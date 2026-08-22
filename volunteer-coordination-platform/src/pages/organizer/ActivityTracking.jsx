import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, QrCode, Lock } from "lucide-react";
import StatusBadge from "../../components/activities/StatusBadge";
import TaskChecklistItem from "../../components/activities/TaskChecklistItem";
import Avatar from "../../components/common/Avatar";
import ConfirmModal from "../../components/common/ConfirmModal";
import AttendanceQrModal from "../../components/activities/AttendanceQrModal";
import Button from "../../components/common/Button";
import {
  getActivityById,
  updateActivityStatus,
} from "../../services/activities";
import {
  getActivityRoster,
  setTaskCompletion,
} from "../../services/applications";
import { deriveStatusFromDates } from "../../utils/activities";
import { useToast } from "../../contexts/ToastContext";
import VolProfileDrawer from "../../components/volunteer/VolProfileDrawer";

const MODAL_COPY = {
  wrap_early: {
    variant: "danger",
    title: "Wrap up activity early?",
    description:
      "This will mark the activity status as completed right away. You won't be able to undo this.",
    confirmLabel: "Wrap Up",
  },
  cancel: {
    variant: "danger",
    title: "Cancel this activity?",
    description:
      "Are you sure you want to cancel this activity? All volunteers in the team will be notified.",
    confirmLabel: "Cancel",
  },
  reconsider: {
    variant: "default",
    title: "Reconsider cancelling this activity?",
    description:
      "This will change the activity status back to what it should currently be.",
    confirmLabel: "Reconsider",
  },
};

export default function ActivityTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activity, setActivity] = useState(null);
  const [roster, setRoster] = useState([]);
  const [status, setStatus] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getActivityById(id), getActivityRoster(id)]).then(
      ([
        { data: activityData, error: activityError },
        { data: rosterData, error: rosterError },
      ]) => {
        if (!isMounted) return;

        if (activityError || !activityData) {
          setError("Couldn't load this activity.");
          setLoading(false);
          return;
        }

        setActivity(activityData);
        setStatus(activityData.status ?? "upcoming");
        setRoster(rosterError ? [] : rosterData);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleTaskComplete = async (applicationId, currentlyComplete) => {
    const nextComplete = !currentlyComplete;

    setRoster((prev) =>
      prev.map((r) =>
        r.applicationId === applicationId
          ? {
              ...r,
              taskCompletedAt: nextComplete ? new Date().toISOString() : null,
            }
          : r,
      ),
    );

    const { error: updateError } = await setTaskCompletion(
      applicationId,
      nextComplete,
    );

    if (updateError) {
      setRoster((prev) =>
        prev.map((r) =>
          r.applicationId === applicationId
            ? {
                ...r,
                taskCompletedAt: currentlyComplete
                  ? new Date().toISOString()
                  : null,
              }
            : r,
        ),
      );
      showToast({
        type: "error",
        message: "Couldn't update this task. Try again.",
      });
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction || !activity) return;

    const nextStatus =
      confirmAction.type === "wrap_early"
        ? "completed"
        : confirmAction.type === "cancel"
          ? "cancelled"
          : deriveStatusFromDates(activity.starts_at, activity.ends_at);

    setIsUpdating(true);
    const { error: updateError } = await updateActivityStatus(
      activity.id,
      nextStatus,
    );
    setIsUpdating(false);
    setConfirmAction(null);

    if (updateError) {
      showToast({
        type: "error",
        message: "Couldn't update the activity. Try again.",
      });
      return;
    }

    setStatus(nextStatus);
    showToast({ type: "success", message: "Activity updated." });
  };

  const copy = confirmAction ? MODAL_COPY[confirmAction.type] : null;

  const handleOpenQrModal = () => {
    setShowQrModal(true);
  };

  if (loading) {
    return <p className="font-inter text-sm text-purple-600/60">Loading...</p>;
  }

  if (error || !activity) {
    return (
      <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
        {error || "Activity not found."}
      </div>
    );
  }

  const checkedIn = roster.filter((r) => r.checkedInAt).length;
  const totalRegistered = roster.length;
  const attendancePercent = totalRegistered
    ? Math.round((checkedIn / totalRegistered) * 100)
    : 0;

  const isUpcoming = status === "upcoming";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isLocked = isUpcoming || isCompleted || isCancelled;

  return (
    <div className="mx-auto max-w-6xl pb-12">
      {/* Top Navigation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-2 font-sora text-sm font-bold text-purple-600 hover:underline cursor-pointer"
        >
          ← Back
        </button>
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Team & Tasks - {activity.name}
        </h1>
      </div>

      {/* Control Card Status & Actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-purple-200/60 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="font-sora text-xs font-bold uppercase tracking-wide text-purple-600/60">
            Current Status
          </span>
          <StatusBadge status={status} />
        </div>

        {!isCompleted && !isCancelled && (
          <div className="flex flex-wrap items-center gap-3">
            {!isUpcoming && (
              <Button
                variant="danger"
                onClick={() => setConfirmAction({ type: "wrap_early" })}
              >
                Wrap Activity Early
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => setConfirmAction({ type: "cancel" })}
            >
              Cancel Activity
            </Button>
          </div>
        )}

        {isCancelled && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setConfirmAction({ type: "reconsider" })}
            >
              Reconsider
            </Button>
          </div>
        )}
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column Attendance & Tasks */}
        <div className="space-y-6 lg:col-span-2">
          {/* Attendance Card */}
          <div className="flex flex-col gap-4 rounded-2xl border border-purple-200/60 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-50">
                <span className="font-sora text-xl font-extrabold text-purple-600">
                  {attendancePercent}%
                </span>
              </div>
              <div>
                <p className="flex items-center gap-1.5 font-sora text-xs font-bold uppercase tracking-wide text-purple-600/60">
                  <Users className="h-3.5 w-3.5" />
                  Attendance
                </p>
                <p className="font-sora text-2xl font-extrabold text-purple-600">
                  {checkedIn}/{totalRegistered}
                </p>
                <p className="font-inter text-xs text-purple-600/50">
                  volunteers checked in
                </p>
              </div>
            </div>

            {!isCompleted && !isCancelled && (
              <Button
                variant="outline"
                disabled={isUpcoming}
                onClick={handleOpenQrModal}
                className="self-start sm:self-center"
              >
                <QrCode className="h-4 w-4" />
                Attendance QR
              </Button>
            )}
          </div>

          {/* Tasks Card */}
          <div className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-sora text-lg font-extrabold text-purple-600">
                  Tasks
                </h2>
                {isLocked && (
                  <span className="flex items-center gap-1 rounded-full border border-purple-200/60 bg-purple-50 px-2.5 py-0.5 font-sora text-xs font-semibold text-purple-600/70">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>
              <span className="font-inter text-sm text-purple-600/60">
                {roster.filter((r) => r.taskCompletedAt).length}/{roster.length}{" "}
                done
              </span>
            </div>

            {isUpcoming && (
              <p className="mb-4 font-inter text-xs text-purple-600/60">
                Task assignments are visible below. Marking tasks complete
                unlocks once the activity starts.
              </p>
            )}
            {isCompleted && (
              <p className="mb-4 font-inter text-xs text-purple-600/60">
                This activity is completed. Task checklist is now read-only.
              </p>
            )}
            {isCancelled && (
              <p className="mb-4 font-inter text-xs text-purple-600/60">
                This activity was cancelled. Task checklist is locked.
              </p>
            )}

            <div
              className={`flex flex-col gap-3 ${isLocked ? "pointer-events-none select-none opacity-80" : ""}`}
            >
              {roster.map((entry) => (
                <TaskChecklistItem
                  key={entry.applicationId}
                  task={{
                    id: entry.applicationId,
                    name: entry.taskName,
                    description: entry.taskDescription,
                    completed: Boolean(entry.taskCompletedAt),
                    assignee: entry.volunteerName,
                  }}
                  onToggleComplete={() =>
                    !isLocked &&
                    toggleTaskComplete(
                      entry.applicationId,
                      Boolean(entry.taskCompletedAt),
                    )
                  }
                />
              ))}

              {roster.length === 0 && (
                <p className="font-inter text-sm text-purple-600/50">
                  No tasks were chosen by volunteers yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column Team Roster */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-purple-200/60 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sora text-lg font-extrabold text-purple-600">
                Team ({roster.length})
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-purple-100">
              {roster.map((entry) => (
                <div
                  key={entry.applicationId}
                  onClick={() => setSelectedVolunteer(entry)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-purple-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={entry.volunteerAvatarUrl}
                      name={entry.volunteerName}
                      size={40}
                    />
                    <div>
                      <p className="font-sora text-sm font-bold text-purple-600">
                        {entry.volunteerName}
                      </p>
                      <p
                        className={`font-inter text-xs font-medium ${
                          entry.taskCompletedAt
                            ? "text-teal-600"
                            : "text-amber-800"
                        }`}
                      >
                        {entry.taskCompletedAt
                          ? "Task Completed"
                          : "Task Incomplete"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      entry.checkedInAt
                        ? "border-teal-200/60 bg-teal-50 text-teal-700"
                        : "border-amber-200/60 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {entry.checkedInAt ? "Checked-In" : "Not Checked-In"}
                  </span>
                </div>
              ))}

              {roster.length === 0 && (
                <p className="py-3 font-inter text-sm text-purple-600/50">
                  No volunteers were added to the team yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmAction !== null}
        variant={copy?.variant}
        title={copy?.title}
        description={copy?.description}
        confirmLabel={copy?.confirmLabel}
        isLoading={isUpdating}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <AttendanceQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        checkinUrl={`${window.location.origin}/checkin/${activity.checkin_token}`}
        activityName={activity.name}
      />

      <VolProfileDrawer
        isOpen={Boolean(selectedVolunteer)}
        onClose={() => setSelectedVolunteer(null)}
        applicant={selectedVolunteer}
      />
    </div>
  );
}
