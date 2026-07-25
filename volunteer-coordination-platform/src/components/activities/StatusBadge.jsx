export const STATUS_META = {
  upcoming: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-400", label: "Upcoming" },
  active: { bg: "bg-teal-50", text: "text-teal-600", dot: "bg-teal-400", label: "Happening now" },
  completed: { bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-400", label: "Completed" },
  cancelled: { bg: "bg-coral-50", text: "text-coral-600", dot: "bg-coral-600", label: "Cancelled" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_META[status] ?? STATUS_META.upcoming;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-sora text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}