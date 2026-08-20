import React from "react";

export const STATUS_META = {
  // Activity Lifecycle Statuses
  upcoming: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-400", label: "Upcoming" },
  active: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400", label: "Happening now" },
  completed: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400", label: "Completed" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Cancelled" },

  // Application Statuses
  submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Pending Approval" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Approved" },
  rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Declined" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_META[status?.toLowerCase()] ?? STATUS_META.upcoming;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-sora text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}