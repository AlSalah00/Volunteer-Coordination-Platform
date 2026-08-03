import { supabase } from "../lib/supabaseClient";
import { getLevelInfo } from "../utils/leveling";

async function uploadAvatar(file, userId) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;
 
  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
  if (uploadError) return { url: null, error: uploadError };
 
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return { url: data.publicUrl, error: null };
}
 
export async function updateOrganizerProfile({
  orgName,
  bio,
  address,
  contactNumber,
  avatar,
  existingAvatarUrl,
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
 
  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }
 
  let avatarUrl = existingAvatarUrl ?? null;
  if (avatar === null) {
    avatarUrl = null;
  } else if (avatar instanceof File) {
    const { url, error: uploadError } = await uploadAvatar(avatar, user.id);
    if (uploadError) return { data: null, error: uploadError };
    avatarUrl = url;
  }
 
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, bio: bio || null, contact_number: contactNumber || null })
    .eq("id", user.id);
 
  if (profileError) return { data: null, error: profileError };
 
  const { error: orgError } = await supabase
    .from("organizer_profiles")
    .update({ org_name: orgName, address: address || null })
    .eq("profile_id", user.id);
 
  if (orgError) return { data: null, error: orgError };
 
  return { data: true, error: null };
}

export async function updateVolunteerProfile({
  firstName,
  lastName,
  bio,
  contactNumber,
  location,
  skills,
  interests,
  availability,
  avatar,
  existingAvatarUrl,
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  let avatarUrl = existingAvatarUrl ?? null;
  if (avatar === null) {
    avatarUrl = null;
  } else if (avatar instanceof File) {
    const { url, error: uploadError } = await uploadAvatar(avatar, user.id);
    if (uploadError) return { data: null, error: uploadError };
    avatarUrl = url;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      bio: bio || null,
      contact_number: contactNumber || null,
    })
    .eq("id", user.id);

  if (profileError) return { data: null, error: profileError };

  const { error: volError } = await supabase
    .from("volunteer_profiles")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      location: location || null,
      skills: skills ?? [],
      interests: interests ?? [],
      availability: availability ?? {},
    })
    .eq("profile_id", user.id);

  if (volError) return { data: null, error: volError };

  return { data: true, error: null };
}

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

export async function getVolunteerProfile() {
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
    .from("volunteer_profiles")
    .select(
      "first_name, last_name, skills, interests, availability, xp, location, profiles(avatar_url, bio, contact_number)"
    )
    .eq("profile_id", user.id)
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error || new Error("Volunteer profile record not found."),
    };
  }

  const levelInfo = getLevelInfo(data.xp ?? 0);

  return {
    data: {
      ...data,
      email: user.email,
      skills: data.skills ?? [],
      interests: data.interests ?? [],
      availability: data.availability ?? {},
      avatar_url: data.profiles?.avatar_url ?? null,
      bio: data.profiles?.bio ?? null,
      contact_number: data.profiles?.contact_number ?? null,
      xp: data.xp ?? 0,
      ...levelInfo,
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