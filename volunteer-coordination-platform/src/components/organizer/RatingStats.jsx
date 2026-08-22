import { Star, MessageSquareText } from "lucide-react";

export default function RatingStats({ reviews = [] }) {
  const totalReviews = reviews.length;

  // Calculate Average Rating
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Calculate Breakdown for 1-5 Stars
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (counts[r.rating] !== undefined) {
      counts[r.rating]++;
    }
  });

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Average Rating Card */}
      <div className="flex items-center gap-5 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200/60">
          <Star className="h-7 w-7 text-purple-600" />
        </div>
        <div>
          <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
            Average Rating
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-sora text-3xl font-extrabold text-purple-600">
              {averageRating}
            </span>
            <span className="font-inter text-xs text-purple-600/60">out of 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(Number(averageRating))
                    ? "fill-purple-600 text-purple-600"
                    : "text-purple-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Total Reviews Card */}
      <div className="flex items-center gap-5 rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200/60">
          <MessageSquareText className="h-7 w-7 text-purple-600" />
        </div>
        <div>
          <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
            Total Reviews
          </p>
          <span className="font-sora text-3xl font-extrabold text-purple-600 mt-0.5 block">
            {totalReviews}
          </span>
          <p className="font-inter text-xs text-purple-600/60">
            {reviews.filter((r) => r.comment?.trim()).length} reviews with feedback
          </p>
        </div>
      </div>

      {/* Rating Distribution Breakdown */}
      <div className="rounded-2xl border border-purple-200/60 bg-white p-5 shadow-xs flex flex-col justify-center">
        <p className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50 mb-2">
          Rating Breakdown
        </p>
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = counts[stars];
            const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-xs font-inter">
                <span className="w-3 font-sora font-bold text-purple-600">{stars}</span>
                <Star className="h-3 w-3 fill-purple-600 text-purple-600 shrink-0" />
                <div className="h-2 flex-1 rounded-full bg-purple-50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-purple-600/60 text-[11px]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}