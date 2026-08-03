// Mirrors the options in TaskCard's LEVEL_OPTIONS and REWARD_OPTIONS. Update both together.
const LEVEL_LABELS = {
  any: "Any level",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const REWARD_LABELS = {
  50: "50 XP",
  100: "100 XP",
  250: "250 XP",
  500: "500 XP",
};

export default function TaskPreviewCard({ index, task }) {
  return (
    <div className="rounded-xl border border-purple-200/60 bg-purple-50/40 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-sora text-sm font-bold text-purple-600">
          {index + 1}. {task.name}
        </span>
        <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold text-purple-600">
          {LEVEL_LABELS[task.level] ?? task.level}
          {REWARD_LABELS[task.reward] ? ` • ${REWARD_LABELS[task.reward]}` : ""}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 font-inter text-sm text-purple-600/70 leading-relaxed">
          {task.description}
        </p>
      )}

      <p className="font-inter text-xs text-purple-600/60">
        {task.capacity} volunteer{task.capacity === 1 ? "" : "s"} needed
      </p>
    </div>
  );
}
