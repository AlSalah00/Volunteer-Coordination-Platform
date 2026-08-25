import { supabase } from "../lib/supabaseClient";

export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });

  return { data: data ?? [], error };
}

export async function getUnreadNotificationCount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0, error: null };

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  return { count: count ?? 0, error };
}

export async function markNotificationAsRead(id) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function markAllNotificationsAsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  return { data, error };
}