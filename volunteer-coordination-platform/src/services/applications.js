import { supabase } from "../lib/supabaseClient";

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