import { supabase } from "../lib/supabaseClient";

export async function getOrganizerProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError };
  }

  return supabase
    .from("organizer_profiles")
    .select("org_name, address, registration_number, verification_status, verified_at")
    .eq("profile_id", user.id)
    .single();
}

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
