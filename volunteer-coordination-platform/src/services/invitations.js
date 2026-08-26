import { supabase } from "../lib/supabaseClient";

export async function sendInvitation({ activityId, taskId, volunteerId, note }) {
  return supabase.rpc("create_invitation", {
    p_activity_id: activityId,
    p_task_id: taskId,
    p_volunteer_id: volunteerId,
    p_note: note || null,
  });
}

export async function respondToInvitation(invitationId, response) {
  return supabase.rpc("respond_to_invitation", {
    p_invitation_id: invitationId,
    p_response: response,
  });
}

export async function getMyInvitations() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error("Not signed in.") };
  }

  return supabase
    .from("invitations")
    .select(
      "id, status, note, created_at, responded_at, activities(id, name, starts_at, ends_at), activity_tasks(id, name, description)"
    )
    .eq("volunteer_id", user.id)
    .order("created_at", { ascending: false });
}

export async function getInvitationById(invitationId) {
  return supabase
    .from("invitations")
    .select("id, status")
    .eq("id", invitationId)
    .single();
}

export async function getActivityInvitations(activityId) {
  return supabase
    .from("invitations")
    .select(
      "id, status, note, created_at, responded_at, volunteer_id, task_id, profiles(volunteer_profiles(first_name, last_name))"
    )
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false });
}

export async function getOrganizerSentInvitations() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError ?? new Error("Not signed in.") };
  }

  const { data, error } = await supabase
    .from("invitations")
    .select(`
      id,
      status,
      note,
      created_at,
      responded_at,
      volunteer_id,
      activity_id,
      task_id,
      activities!inner (
        id,
        name,
        organizer_id
      ),
      activity_tasks (
        id,
        name
      ),
      profiles!volunteer_id (
        avatar_url,
        volunteer_profiles (
          first_name,
          last_name
        )
      )
    `)
    .eq("activities.organizer_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return { data: [], error };

  const formattedData = data.map((inv) => {
    const volProfile = inv.profiles?.volunteer_profiles;
    
    const firstName = volProfile.first_name ?? "";
    const lastName = volProfile.last_name ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || "Unknown Volunteer";

    return {
      id: inv.id,
      status: inv.status,
      note: inv.note,
      createdAt: inv.created_at,
      respondedAt: inv.responded_at,
      activityTitle: inv.activities?.name ?? "Activity",
      taskName: inv.activity_tasks?.name ?? "Task",
      volunteerName: fullName,
      volunteerAvatarUrl: inv.profiles?.avatar_url ?? null,
    };
  });

  return { data: formattedData, error: null };
}