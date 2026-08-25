import { supabase } from "../lib/supabaseClient";

const ACTIVITY_IMAGE_BUCKET = "activity-images";

export async function getActivityById(id) {
  return supabase.from("activities").select("*, activity_tasks(*)").eq("id", id).single();
}

export async function getActivityName(id) {
  return supabase.from("activities").select("name").eq("id", id).single();
}

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

export async function getUpcomingOrganizerActivities() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError ?? new Error("Not signed in.") };
  }

  const { data, error } = await supabase
    .from("activities")
    .select("*, activity_tasks(*)")
    .eq("organizer_id", user.id)
    .eq("status", "upcoming")
    .order("starts_at", { ascending: true });

  return { data: data ?? [], error };
}

export async function getPublicActivities() {
  return supabase
    .from("activities")
    .select("*, activity_tasks(capacity)")
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
}

export async function getPublicActivityById(id) {
  const { data, error } = await supabase
    .from("activities")
    .select("*, activity_tasks(*), profiles(avatar_url, bio, contact_number, email, organizer_profiles(*))")
    .eq("id", id)
    .single();

  if (error) return { data: null, error };

  const rawOrg = data.profiles?.organizer_profiles;
  const orgProfile = Array.isArray(rawOrg) ? rawOrg[0] : rawOrg;

  return {
    data: {
      ...data,
      organizer_name: orgProfile?.org_name ?? "Unknown Organizer",
      organizer_avatar_url: data.profiles?.avatar_url ?? null,
      bio: data.profiles?.bio ?? null,
      contact_number: data.profiles?.contact_number ?? null,
      email: data.profiles?.email ?? null,
      address: orgProfile?.address ?? null,
      registration_no: orgProfile?.registration_number ?? null,
      verification: orgProfile?.verification_status ?? null,
      rating: orgProfile?.average_rating ?? null
    },
    error: null,
  };
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

function buildLocationFields(details) {
  if (details.activityType === "online") {
    return {
      online_platform: details.onlinePlatform || null,
      location_name: null,
      latitude: null,
      longitude: null,
    };
  }
 
  return {
    online_platform: null,
    location_name: details.location?.address ?? details.location ?? null,
    latitude: details.location?.lat ?? null,
    longitude: details.location?.lng ?? null,
  };
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
      overview: details.overview || null,
      online_platform: details.activityType === "online" ? details.onlinePlatform || null : null,
      image_url: imageUrl,
      starts_at: details.startsAt ? new Date(details.startsAt).toISOString() : null,
      ends_at: details.endsAt ? new Date(details.endsAt).toISOString() : null,
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
      reward: task.reward,
    }));

    const { error: tasksError } = await supabase.from("activity_tasks").insert(taskRows);

    if (tasksError) {
      await supabase.from("activities").delete().eq("id", activity.id);
      return { data: null, error: tasksError };
    }
  }

  return { data: activity, error: null };
}

export async function updateActivity(id, { details, tasks }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
 
  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }
 
  let imageUrl = details.existingImageUrl ?? null;
  if (details.image === null) {
    imageUrl = null;
  } else if (details.image instanceof File) {
    const { url, error: uploadError } = await uploadActivityImage(details.image, user.id);
    if (uploadError) return { data: null, error: uploadError };
    imageUrl = url;
  }
 
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .update({
      name: details.name,
      overview: details.overview || null,
      online_platform: details.activityType === "online" ? details.onlinePlatform || null : null,
      image_url: imageUrl,
      starts_at: details.startsAt ? new Date(details.startsAt).toISOString() : null,
      ends_at: details.endsAt ? new Date(details.endsAt).toISOString() : null,
      category: details.category,
      activity_type: details.activityType,
      requirements: details.requirements || null,
      ...buildLocationFields(details),
    })
    .eq("id", id)
    .select()
    .single();
 
  if (activityError) return { data: null, error: activityError };
 
  const { error: deleteTasksError } = await supabase
    .from("activity_tasks")
    .delete()
    .eq("activity_id", id);
 
  if (deleteTasksError) return { data: null, error: deleteTasksError };
 
  if (tasks.length > 0) {
    const taskRows = tasks.map((task) => ({
      activity_id: id,
      name: task.name,
      description: task.description || null,
      capacity: Number(task.capacity),
      level: task.level,
      reward: task.reward,
    }));
 
    const { error: tasksError } = await supabase.from("activity_tasks").insert(taskRows);
    if (tasksError) return { data: null, error: tasksError };
  }
 
  return { data: activity, error: null };
}

export async function checkUserApplicationStatus(activityId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: false,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("applications")
    .select("id")
    .eq("activity_id", activityId)
    .eq("volunteer_id", user.id)
    .maybeSingle();

  return {
    data: Boolean(data),
    error,
  };
}

export async function updateActivityStatus(activityId, status) {
  return supabase.from("activities").update({ status }).eq("id", activityId).select().single();
}
 
// Note this doesn't delete the uploaded photo from Supabase storage.
export async function deleteActivity(id) {
  return supabase.from("activities").delete().eq("id", id);
}