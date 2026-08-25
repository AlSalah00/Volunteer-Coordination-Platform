import { useState, useEffect } from "react";
import { Lock, Send, Sparkles, Check } from "lucide-react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";
import CustomSelect from "../common/CustomSelect";
import { getUpcomingOrganizerActivities } from "../../services/activities";
import { sendInvitation } from "../../services/invitations";
import { hasRequiredTitle } from "../../utils/leveling";
import Button from "../../components/common/Button";
import TextAreaField from "../../components/common/TextAreaField";
import SelectField from "../common/SelectField";

export default function InviteModal({ isOpen, onClose, volunteer, onSuccess }) {
  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [note, setNote] = useState("");

  const [loadingActivities, setLoadingActivities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedActivityId("");
      setSelectedTaskId("");
      setNote("");
      setErrorMsg(null);
      setSuccessMsg(false);
      return;
    }

    setLoadingActivities(true);
    getUpcomingOrganizerActivities().then(({ data, error }) => {
      setLoadingActivities(false);
      if (error) {
        setErrorMsg("Failed to load activities.");
      } else {
        setActivities(data);
      }
    });
  }, [isOpen]);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  const availableTasks = selectedActivity?.activity_tasks ?? [];

  const handleActivityChange = (actId) => {
    setSelectedActivityId(actId);
    setSelectedTaskId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActivityId || !selectedTaskId || !volunteer?.profile_id) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const { error } = await sendInvitation({
      activityId: selectedActivityId,
      taskId: selectedTaskId,
      volunteerId: volunteer.profile_id,
      note: note.trim() || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Failed to send invitation. Please try again.");
    } else {
      setSuccessMsg(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    }
  };

  const activityOptions = activities.map((act) => ({
    value: act.id,
    label: act.title,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Send Invitation
          </h2>
          <p className="mt-0.5 font-inter text-xs text-purple-600/60">
            Invite volunteer to join one of your upcoming activity's team.
          </p>
        </div>

        {/* Selected Volunteer Summary */}
        {volunteer && (
          <div className="flex items-center gap-3 rounded-2xl border border-purple-200/60 bg-purple-50/50 p-3.5">
            <Avatar
              src={volunteer.volunteerAvatarUrl}
              name={volunteer.fullName}
              size={42}
            />
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-sora text-sm font-extrabold text-purple-600">
                {volunteer.fullName}
              </h4>
              <p className="font-inter text-xs text-purple-600/60">
                Level {volunteer.level ?? 1} – {volunteer.title ?? "Volunteer"}
              </p>
            </div>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="rounded-xl border border-coral-200 bg-coral-50 p-3 font-inter text-xs font-semibold text-coral-600">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-inter text-xs font-semibold text-emerald-700">
            <Check className="h-4 w-4 shrink-0" />
            Invitation sent successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Activity */}
          <div>
            <label className="mb-1.5 block font-sora text-xs font-bold uppercase tracking-wider text-purple-600/60">
              1. Select Activity
            </label>
            {loadingActivities ? (
              <div className="rounded-lg border border-purple-200/60 bg-purple-50/40 p-3 text-center font-inter text-xs text-purple-600/50">
                Loading your upcoming activities...
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-lg border border-purple-200/60 bg-purple-50/40 p-3 text-center font-inter text-xs text-purple-600/50">
                No upcoming activities found. Please create an activity first.
              </div>
            ) : (
              <SelectField
                value={selectedActivityId}
                onChange={handleActivityChange}
                options={activityOptions}
                placeholder="Choose an activity..."
              />
            )}
          </div>

          {/* Select Task */}
          {selectedActivityId && (
            <div>
              <label className="mb-1.5 block font-sora text-xs font-bold uppercase tracking-wider text-purple-600/60">
                2. Select Task Slot
              </label>

              {availableTasks.length === 0 ? (
                <p className="font-inter text-xs text-purple-600/50">
                  No tasks available for this activity.
                </p>
              ) : (
                <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
                  {availableTasks.map((task) => {
                    const locked = !hasRequiredTitle(volunteer?.title, task.level);
                    const isSelected = selectedTaskId === task.id;

                    return (
                      <button
                        key={task.id}
                        type="button"
                        disabled={locked}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                          locked
                            ? "cursor-not-allowed border-purple-200/40 bg-purple-50/30 opacity-60"
                            : isSelected
                            ? "cursor-pointer border-purple-600 bg-purple-50"
                            : "cursor-pointer border-purple-200/60 hover:bg-purple-50/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-sora text-xs font-bold text-purple-600">
                              {task.name}
                            </span>
                            {locked && (
                              <Lock className="h-3.5 w-3.5 text-purple-600/40" />
                            )}
                          </div>
                          {task.description && (
                            <p className="mt-1 font-inter text-[11px] leading-relaxed text-purple-600/60">
                              {task.description}
                            </p>
                          )}
                          {locked && (
                            <p className="mt-1 font-inter text-[10px] font-medium text-coral-600">
                              Requires {task.level} title
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Personal Note */}
          {selectedTaskId && (
            <div>
              <label className="mb-1.5 block font-sora text-xs font-bold uppercase tracking-wider text-purple-600/60">
                3. Personal Note (Optional)
              </label>
              <TextAreaField
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note explaining why you think they would be a great fit..."
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedActivityId || !selectedTaskId || isSubmitting || successMsg}
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}