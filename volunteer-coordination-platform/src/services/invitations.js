import { supabase } from "../lib/supabaseClient";

/**
 * Sends an invitation. All validation (ownership, activity must be
 * upcoming, no duplicate invite/application) happens inside
 * create_invitation itself — this is just the RPC call.
 */
export async function sendInvitation({ activityId, taskId, volunteerId, note }) {
  return supabase.rpc("create_invitation", {
    p_activity_id: activityId,
    p_task_id: taskId,
    p_volunteer_id: volunteerId,
    p_note: note || null,
  });
}

/**
 * Accept or decline. response must be "accepted" or "declined".
 */
export async function respondToInvitation(invitationId, response) {
  return supabase.rpc("respond_to_invitation", {
    p_invitation_id: invitationId,
    p_response: response,
  });
}

/**
 * Pending invitations for the signed-in volunteer, with enough activity
 * and task context to show what they're being asked to join without a
 * second fetch.
 */
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

/**
 * Every invitation an organizer has sent for one activity — used on the
 * Recruit page to avoid re-inviting someone already invited, and to show
 * status (pending/accepted/declined) for invites already sent.
 */
export async function getActivityInvitations(activityId) {
  return supabase
    .from("invitations")
    .select(
      "id, status, note, created_at, responded_at, volunteer_id, task_id, profiles(volunteer_profiles(first_name, last_name))"
    )
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false });
}