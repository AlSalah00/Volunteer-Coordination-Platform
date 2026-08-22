import { useEffect, useState } from "react";
import { Search, MessageSquareOff } from "lucide-react";
import RatingStats from "../../components/organizer/RatingStats";
import ReviewCard from "../../components/organizer/ReviewCard";
import ReviewDetailModal from "../../components/organizer/ReviewDetailModal";
import { getOrganizerReviews } from "../../services/reviews";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      const { data, error } = await getOrganizerReviews();
      if (error) {
        setError("Failed to load reviews.");
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

  // Filter reviews by activity name or volunteer name
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.activityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.volunteer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Only cards with non-empty comments are rendered in the grid
  const commentReviews = filteredReviews.filter((r) => r.comment?.trim());

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Reviews
        </h1>
        <p className="mb-8 font-inter text-sm text-purple-600/60">
          All reviews for your completed activities appear here.
        </p>

        {/* Rating Stats Summary */}
        <RatingStats reviews={reviews} />

        {/* Search Input */}
        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by activity name, volunteer, or keyword..."
              className="w-full rounded-md border border-purple-600/20 bg-white py-2.5 pl-11 pr-4 font-inter text-sm text-purple-800 placeholder:text-purple-600/40 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center font-inter text-sm text-purple-600/60">
            Loading reviews...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-coral-200 bg-coral-50 p-4 text-center font-inter text-sm text-coral-600">
            {error}
          </div>
        )}

        {/* Reviews Card Grid */}
        {!loading && !error && (
          <>
            {commentReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {commentReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200/80 bg-white p-12 text-center">
                <MessageSquareOff className="mb-3 h-10 w-10 text-purple-300" />
                <p className="font-sora text-base font-bold text-purple-600">
                  No Written Reviews Found
                </p>
                <p className="mt-1 font-inter text-xs text-purple-600/60">
                  {searchQuery
                    ? "Try adjusting your search filter."
                    : "Volunteers haven't submitted any written feedback comments yet."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}