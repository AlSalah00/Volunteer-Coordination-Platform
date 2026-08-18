const STATUS_META = {
  submitted: { bg: "bg-amber-50", text: "text-amber-800", label: "Awaiting Your Decision" },
  approved: { bg: "bg-teal-50", text: "text-teal-600", label: "Added To The Team" },
  rejected: { bg: "bg-coral-50", text: "text-coral-600", label: "Not Selected" },
};

export default function ApplicantStatusBadge({ status }) {
  const style = STATUS_META[status] ?? STATUS_META.submitted;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-sora text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
