import { ShieldHalf, Trophy } from "lucide-react";

export default function AchievementStats({
  level = 1,
  title = "Beginner",
  earnedCount = 0,
  totalCount = 0,
  loadingProfile = false,
}) {
  const progressPercentage = totalCount
    ? Math.round((earnedCount / totalCount) * 100)
    : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Level & Title Stat Card */}
      <div className="flex items-center gap-5 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200/60">
          <ShieldHalf className="h-7 w-7 text-purple-600" />
        </div>
        <div>
          <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
            Current Level
          </p>

          {loadingProfile ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-purple-100 my-1" />
          ) : (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-sora text-3xl font-extrabold text-purple-600">
                Level {level}
              </span>
            </div>
          )}

          <div className="mt-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 border border-amber-200/60 font-sora text-xs font-bold text-amber-700">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Earned Achievements Stat Card */}
      <div className="flex items-center gap-5 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200/60">
          <Trophy className="h-7 w-7 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
            Achievements Earned
          </p>

          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-sora text-3xl font-extrabold text-purple-600">
              {earnedCount}
            </span>
            <span className="font-inter text-xs text-purple-600/60">
              of {totalCount} total ({progressPercentage}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5 h-2 w-full rounded-full bg-purple-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}