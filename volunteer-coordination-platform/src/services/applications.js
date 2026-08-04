import { supabase } from "../lib/supabaseClient";

export async function submitApplication({ activityId, taskId }) {
  return supabase.functions.invoke("submit-application", {
    body: { activityId, taskId },
  });
}