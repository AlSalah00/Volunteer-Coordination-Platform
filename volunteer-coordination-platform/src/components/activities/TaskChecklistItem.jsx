import { Check } from "lucide-react";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TaskChecklistItem({ task, onToggleComplete }) {
  const isComplete = task.completed;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
        isComplete ? "border-teal-400/30 bg-teal-50/50" : "border-purple-200/60 bg-purple-50/40"
      }`}
    >
      <button
        type="button"
        onClick={onToggleComplete}
        aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer ${
          isComplete
            ? "border-teal-600 bg-teal-600 text-teal-50"
            : "border-purple-600/30 text-transparent hover:border-purple-600"
        }`}
      >
        <Check className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-sora text-sm font-bold ${
            isComplete ? "text-purple-600/50 line-through" : "text-purple-600"
          }`}
        >
          {task.name}
        </p>
        {task.description && (
          <p
            className={`mt-0.5 font-inter text-xs ${
              isComplete ? "text-purple-600/30" : "text-purple-600/60"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 font-sora text-[10px] font-bold text-purple-50">
          {getInitials(task.assignee)}
        </div>
        <span className="max-w-25 truncate font-inter text-xs text-purple-600/60">
          {task.assignee ?? "Unassigned"}
        </span>
      </div>
    </div>
  );
}
