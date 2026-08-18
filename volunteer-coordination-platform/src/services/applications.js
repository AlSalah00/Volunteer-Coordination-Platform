import { supabase } from "../lib/supabaseClient";

export async function getActivityApplicants(activityId) {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, status, created_at, volunteer_id, profiles(avatar_url, volunteer_profiles(first_name, last_name)), activity_tasks(name), ai_evaluations(match_result, organizer_reasoning)"
    )
    .eq("activity_id", activityId);
 
  if (error) return { data: null, error };
 
  const flattened = data.map((row) => {
    const volunteerProfile = row.profiles?.volunteer_profiles;
    return {
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      volunteerId: row.volunteer_id,
      volunteerName: volunteerProfile
        ? `${volunteerProfile.first_name} ${volunteerProfile.last_name}`.trim()
        : "Volunteer",
      volunteerAvatarUrl: row.profiles?.avatar_url ?? null,
      taskName: row.activity_tasks?.name ?? "Unspecified task",
      matchResult: row.ai_evaluations?.match_result ?? null,
      organizerReasoning: row.ai_evaluations?.organizer_reasoning ?? null,
    };
  });
 
  const rank = { good_match: 0, low_match: 2 };
  flattened.sort((a, b) => (rank[a.matchResult] ?? 1) - (rank[b.matchResult] ?? 1));
 
  return { data: flattened, error: null };
}

export async function getApplicationDetails(applicationId) {
  const [{ data: application, error: applicationError }, { data: feedback }] = await Promise.all([
    supabase
      .from("applications")
      .select("id, status, created_at, activities(id, name, status), activity_tasks(name, description, level)")
      .eq("id", applicationId)
      .single(),
    supabase
      .from("my_application_feedback")
      .select("volunteer_feedback")
      .eq("application_id", applicationId)
      .maybeSingle(),
  ]);
 
  if (applicationError) return { data: null, error: applicationError };
 
  return {
    data: {
      ...application,
      volunteerFeedback: feedback?.volunteer_feedback ?? null,
    },
    error: null,
  };
}
 
export async function withdrawApplication(applicationId) {
  return supabase.from("applications").delete().eq("id", applicationId);
}

export async function getMyApplications() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
 
  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }
 
  return supabase
    .from("applications")
    .select("id, status, task_id, created_at, activities(*, activity_tasks(capacity))")
    .eq("volunteer_id", user.id)
    .order("created_at", { ascending: false });
}

export async function submitApplication({ activityId, taskId }) {
  return supabase.functions.invoke("submit-application", {
    body: { activityId, taskId },
  });
}

export async function updateApplicationStatus(applicationId, status) {
  return supabase.from("applications").update({ status }).eq("id", applicationId).select().single();
}