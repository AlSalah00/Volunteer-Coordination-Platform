import { supabase } from "../lib/supabaseClient";

export async function getOrganizerProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("No active session found. Please log in again."),
    };
  }

  const { data, error } = await supabase
    .from("organizer_profiles")
    .select(
      "org_name, address, registration_number, verification_status, verified_at, average_rating, profiles(avatar_url, bio, contact_number)"
    )
    .eq("profile_id", user.id)
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error || new Error("Organizer profile record not found."),
    };
  }

  return {
    data: {
      ...data,
      email: user.email,
      avatar_url: data.profiles?.avatar_url ?? null,
      bio: data.profiles?.bio ?? null,
      contact_number: data.profiles?.contact_number ?? null,
    },
    error: null,
  };
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