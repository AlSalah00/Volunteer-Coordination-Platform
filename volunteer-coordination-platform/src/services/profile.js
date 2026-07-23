import { supabase } from "../lib/supabaseClient";

export async function getCurrentProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError };
  }

  return supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", user.id)
    .single();
}