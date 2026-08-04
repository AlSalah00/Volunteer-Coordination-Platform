import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Lock } from "lucide-react";

import Modal from "../common/Modal";
import { hasRequiredTitle } from "../../utils/leveling";

export default function TaskSelectionModal({
  isOpen,
  onClose,
  tasks,
  isSubmitting,
  onConfirm,
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const { volunteerProfile } = useOutletContext();

  const handleConfirm = () => {
    if (!selectedTaskId) return;
    onConfirm(selectedTaskId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <h2 className="mb-1.5 font-sora text-lg font-extrabold text-purple-600">
        Pick a Task
      </h2>

      <p className="mb-5 font-inter text-sm text-purple-600/60">
        Choose the one that fits you best. You can only apply to one for now.
      </p>

      <div className="mb-6 flex max-h-80 flex-col gap-2.5 overflow-y-auto pr-1">
        {tasks.map((task) => {
          const locked = !hasRequiredTitle(volunteerProfile.title, task.level);

          const isSelected = selectedTaskId === task.id;

          return (
            <button
              key={task.id}
              type="button"
              disabled={locked}
              onClick={() => setSelectedTaskId(task.id)}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                locked
                  ? "cursor-not-allowed border-purple-200/40 bg-purple-50/30 opacity-60"
                  : isSelected
                    ? "cursor-pointer border-purple-600 bg-purple-50"
                    : "cursor-pointer border-purple-200/60 hover:bg-purple-50/50"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-sora text-sm font-bold text-purple-600">
                    {task.name}
                  </span>

                  {locked && (
                    <Lock className="h-3.5 w-3.5 text-purple-600/40" />
                  )}
                </div>

                {task.description && (
                  <p className="mt-1 font-inter text-xs leading-relaxed text-purple-600/60">
                    {task.description}
                  </p>
                )}

                {locked && (
                  <p className="mt-1.5 font-inter text-xs font-medium text-coral-600">
                    Requires {task.level} title
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer rounded-md px-4 py-2.5 font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedTaskId || isSubmitting}
          className="cursor-pointer rounded-md bg-purple-600 px-5 py-2.5 font-sora text-sm font-bold text-purple-50 transition-all duration-200 hover:bg-purple-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {isSubmitting ? "Submitting..." : "Confirm & Apply"}
        </button>
      </div>
    </Modal>
  );
}
