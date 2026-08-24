import { supabase } from "../lib/supabaseClient";

/**
 * The full achievement catalog, merged with which ones the signed-in
 * volunteer has earned. Two separate queries rather than one embedded
 * join — a left-join-with-filter through PostgREST embedding gets
 * ambiguous about whether it's scoping rows or just adding data, so it's
 * clearer to fetch the catalog and the earned set independently and
 * merge them here.
 */
export async function getVolunteerAchievements() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  const [{ data: achievements, error: achievementsError }, { data: earned, error: earnedError }] =
    await Promise.all([
      supabase
        .from("achievements")
        .select("id, title, description, icon, category, threshold")
        .order("category")
        .order("threshold"),
      supabase.from("volunteer_achievements").select("achievement_id, earned_at").eq("volunteer_id", user.id),
    ]);

  if (achievementsError) return { data: null, error: achievementsError };
  if (earnedError) return { data: null, error: earnedError };

  const earnedMap = new Map(earned.map((e) => [e.achievement_id, e.earned_at]));

  const merged = achievements.map((achievement) => ({
    ...achievement,
    isEarned: earnedMap.has(achievement.id),
    earnedAt: earnedMap.get(achievement.id) ?? null,
  }));

  return {
    data: {
      achievements: merged,
      earnedCount: earned.length,
      totalCount: achievements.length,
    },
    error: null,
  };
}