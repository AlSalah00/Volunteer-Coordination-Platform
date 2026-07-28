import { supabase } from "../lib/supabaseClient";

export async function signUpVolunteer({ firstName, lastName, email, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "volunteer",
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
}

export async function signUpOrganizer({ orgName, email, address, registrationNumber, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "organizer",
        org_name: orgName,
        address,
        registration_number: registrationNumber,
      },
    },
  });
}

export const signInWithGoogle = async (role = "volunteer") => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      data: {
        role: role
      }
    },
  });

  if (error) return { error };
  return { data };
};

export async function signIn({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function sendPasswordResetEmail(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function deleteAccount() {
  return supabase.functions.invoke("delete-account");
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}