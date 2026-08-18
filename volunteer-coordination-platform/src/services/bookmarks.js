import { supabase } from "../lib/supabaseClient";

export async function getBookmarkedActivities() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("bookmarks")
    .select("activity_id, activities(*, activity_tasks(capacity))")
    .eq("volunteer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const activities = data.map((item) => item.activities).filter(Boolean);
  return { data: activities, error: null };
}

export async function getUserBookmarkIds() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("bookmarks")
    .select("activity_id")
    .eq("volunteer_id", user.id);

  if (error) return { data: null, error };

  return { data: data.map((b) => b.activity_id), error: null };
}

// Toggle bookmark state
export async function toggleBookmark(activityId, isCurrentlyBookmarked) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User not authenticated" };

  if (isCurrentlyBookmarked) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("volunteer_id", user.id)
      .eq("activity_id", activityId);
    return { error };
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ volunteer_id: user.id, activity_id: activityId });
    return { error };
  }
}