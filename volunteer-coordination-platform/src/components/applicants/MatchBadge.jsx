const MATCH_META = {
  good_match: { bg: "bg-teal-50", text: "text-teal-600", label: "Great Fit" },
  low_match: { bg: "bg-amber-50", text: "text-amber-800", label: "Worth a Look" },
};

export default function MatchBadge({ matchResult }) {
  const style = MATCH_META[matchResult];
  if (!style) return null;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-sora text-[11px] font-bold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
