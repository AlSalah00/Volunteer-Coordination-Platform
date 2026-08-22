import { supabase } from "../lib/supabaseClient";

export async function submitReview({ activityId, organizerId, rating, comment }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User not authenticated" };

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      activity_id: activityId,
      organizer_id: organizerId,
      volunteer_id: user.id,
      rating,
      comment: comment?.trim() || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function checkHasReviewed(activityId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { hasReviewed: false, review: null, error: null };

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("activity_id", activityId)
    .eq("volunteer_id", user.id)
    .maybeSingle();

  if (error) return { hasReviewed: false, review: null, error };
  return { hasReviewed: Boolean(data), review: data, error: null };
}

export async function getOrganizerReviews() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  // Destructure { data, error } here
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      activities ( name ),
      profiles!volunteer_id (
        avatar_url,
        volunteer_profiles ( first_name, last_name )
      )
    `)
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const formattedData = (data || []).map((row) => {
    const vp = Array.isArray(row.profiles?.volunteer_profiles)
      ? row.profiles?.volunteer_profiles[0]
      : row.profiles?.volunteer_profiles;

    return {
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      created_at: row.created_at,
      activityName: row.activities?.name ?? "Volunteer Activity",
      volunteer: {
        name: vp
          ? `${vp.first_name} ${vp.last_name}`.trim()
          : "Anonymous Volunteer",
        avatarUrl: row.profiles?.avatar_url ?? null,
      },
    };
  });

  return { data: formattedData, error: null };
}