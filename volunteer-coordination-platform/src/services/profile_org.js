import { supabase } from "../lib/supabaseClient";

/**
 * Fetches the signed-in user's profile row (role + shared fields).
 * Returns { data, error }, same shape as the auth service.
 *
 * The profile row is created by a database trigger in the same transaction
 * as the auth account, so for anyone who went through your sign-up flow,
 * this is guaranteed to exist by the time they have a session. `data` only
 * comes back null for accounts created outside that flow (e.g. added
 * directly from the Supabase dashboard) — worth treating as its own state
 * in the UI rather than assuming it can't happen.
 */
/**
 * Fetches the organizer-specific profile row (org name, address,
 * verification status, etc). Separate from getCurrentProfile() because
 * only organizer pages need this — no reason to pull it into the global
 * AuthContext when volunteer pages never touch it.
 */
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
