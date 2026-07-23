const STATUS_STYLES = {
  upcoming: { bg: "bg-amber-50", text: "text-amber-800", label: "Upcoming" },
  active: { bg: "bg-teal-50", text: "text-teal-600", label: "Happening now" },
  completed: { bg: "bg-gray-50", text: "text-gray-400", label: "Completed" },
  cancelled: { bg: "bg-coral-50", text: "text-coral-600", label: "Cancelled" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.upcoming;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-sora text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
