import { supabase } from "../lib/supabaseClient";

const ACTIVITY_IMAGE_BUCKET = "activity-images";

export async function getOrganizerActivities() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
 
  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }
 
  return supabase
    .from("activities")
    .select("*, activity_tasks(capacity)")
    .eq("organizer_id", user.id)
    .order("starts_at", { ascending: true });
}

async function uploadActivityImage(file, organizerId) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${organizerId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(ACTIVITY_IMAGE_BUCKET)
    .upload(filePath, file);

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from(ACTIVITY_IMAGE_BUCKET).getPublicUrl(filePath);
  return { url: data.publicUrl, error: null };
}

export async function createActivity({ details, tasks }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  let imageUrl = null;
  if (details.image) {
    const { url, error: uploadError } = await uploadActivityImage(details.image, user.id);
    if (uploadError) return { data: null, error: uploadError };
    imageUrl = url;
  }

  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({
      organizer_id: user.id,
      name: details.name,
      image_url: imageUrl,
      starts_at: details.startsAt,
      ends_at: details.endsAt,
      category: details.category,
      activity_type: details.activityType,
      location_name: details.location?.address ?? details.location ?? null,
      latitude: details.location?.lat ?? null,
      longitude: details.location?.lng ?? null,
      requirements: details.requirements || null,
    })
    .select()
    .single();

  if (activityError) return { data: null, error: activityError };

  if (tasks.length > 0) {
    const taskRows = tasks.map((task) => ({
      activity_id: activity.id,
      name: task.name,
      description: task.description || null,
      capacity: Number(task.capacity),
      level: task.level,
    }));

    const { error: tasksError } = await supabase.from("activity_tasks").insert(taskRows);

    if (tasksError) {
      await supabase.from("activities").delete().eq("id", activity.id);
      return { data: null, error: tasksError };
    }
  }

  return { data: activity, error: null };
}