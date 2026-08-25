import { supabase } from "../lib/supabaseClient";

export async function getOrganizerDashboardMetrics() {
  return supabase.rpc("get_organizer_dashboard_metrics").single();
}

export async function getOrganizerUpcomingActivities() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  const now = new Date();
  const threeMonthsOut = new Date(now);
  threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

  return supabase
    .from("activities")
    .select("id, name, starts_at, ends_at")
    .eq("organizer_id", user.id)
    .neq("status", "cancelled")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", threeMonthsOut.toISOString())
    .order("starts_at", { ascending: true });
}