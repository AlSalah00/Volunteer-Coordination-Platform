import { Star, Calendar } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatDateTime } from "../../utils/activities";

export default function ReviewCard({ review, onClick }) {
  const { volunteer, rating = 0, comment, created_at, activityName } = review;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Volunteer Profile */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={volunteer?.avatarUrl}
              name={volunteer?.name || "Anonymous"}
              size={44}
            />
            <div>
              <span className="block font-sora text-sm font-bold text-purple-600">
                {volunteer?.name || "Anonymous Volunteer"}
              </span>
              {created_at && (
                <span className="flex items-center gap-1 font-inter text-[11px] text-purple-600/50">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(created_at)}
                </span>
              )}
            </div>
          </div>

          {/* Google-Style Star Rating */}
          <div
            className="flex items-center gap-0.5"
            aria-label={`Rating: ${rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                className={`h-4 w-4 ${
                  starIndex <= rating
                    ? "fill-purple-600 text-purple-600"
                    : "fill-slate-100 text-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Activity Name */}
        <div className="mb-2">
          <span className="inline-block rounded-md bg-purple-50 px-2.5 py-1 font-sora text-xs font-semibold text-purple-600">
            {activityName || "Volunteer Activity"}
          </span>
        </div>

        {/* Comment Snippet */}
        <p className="line-clamp-3 font-inter text-sm leading-relaxed text-purple-800/80">
          "{comment}"
        </p>
      </div>
    </div>
  );
}