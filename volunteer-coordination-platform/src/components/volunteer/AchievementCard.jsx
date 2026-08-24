import { Calendar, Lock, CheckCircle2 } from "lucide-react";
import { getAchievementIcon } from "../../utils/achievementIcons";
import { formatDateTime } from "../../utils/activities";

export default function AchievementCard({ achievement }) {
  const { title, description, icon, isEarned, earnedAt } = achievement;
  const IconComponent = getAchievementIcon(icon);

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
        isEarned
          ? "border-purple-200/80 bg-white shadow-xs hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
          : "border-purple-200/80 bg-purple-50/40 opacity-70 grayscale-35"
      }`}
    >
      <div>
        {/* Top Header Icon & Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${
              isEarned
                ? "border-purple-200/60 bg-purple-50 text-purple-600"
                : "border-purple-200/50 bg-purple-100/50 text-purple-600/40"
            }`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {isEarned ? (
            <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 font-sora text-xs font-bold text-teal-700 border border-teal-200/60">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Earned
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-purple-100/60 px-2.5 py-1 font-sora text-xs font-bold text-purple-600/50 border border-purple-200/40">
              <Lock className="h-3.5 w-3.5" />
              Not Earned
            </span>
          )}
        </div>

        {/* Achievement Info */}
        <h3
          className={`font-sora text-base font-extrabold ${
            isEarned ? "text-purple-600" : "text-purple-900/60"
          }`}
        >
          {title}
        </h3>
        <p className="mt-1 font-inter text-xs leading-relaxed text-purple-600/70">
          {description}
        </p>
      </div>

      {/* Earned Date Footer */}
      {isEarned && earnedAt && (
        <div className="mt-4 pt-3 border-t border-purple-100 flex items-center gap-1.5 font-inter text-[11px] text-purple-600/50">
          <Calendar className="h-3 w-3" />
          Earned {formatDateTime(earnedAt)}
        </div>
      )}
    </div>
  );
}