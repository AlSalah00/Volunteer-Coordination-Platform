import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import Button from "./Button";

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  activityTitle,
  isSubmitting = false,
  readOnly = false,
  existingReview = null,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen && existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    } else if (isOpen && !existingReview) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setValidationError("");
    }
  }, [isOpen, existingReview]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) {
      handleClose();
      return;
    }
    if (rating === 0) {
      setValidationError("Please select a star rating.");
      return;
    }
    setValidationError("");
    onSubmit({ rating, comment });
  };

  const handleClose = () => {
    if (!readOnly) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setValidationError("");
    }
    onClose();
  };

  const currentRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div>
            <h3 className="font-sora text-lg font-extrabold text-purple-600">
              {readOnly ? "Your Submitted Review" : "Leave a Review"}
            </h3>
            {activityTitle && (
              <p className="line-clamp-1 font-inter text-xs text-purple-600/60">
                {activityTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-purple-600/50 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Rating Stars */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-purple-600/60">
              {readOnly ? "Your Rating" : "Select Rating"}
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    if (readOnly) return;
                    setRating(star);
                    setValidationError("");
                  }}
                  onMouseEnter={() => !readOnly && setHoverRating(star)}
                  onMouseLeave={() => !readOnly && setHoverRating(0)}
                  className={`p-1 transition-transform ${
                    readOnly
                      ? "cursor-default"
                      : "hover:scale-110 cursor-pointer focus:outline-none"
                  }`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= currentRating
                        ? "fill-purple-600 text-purple-600"
                        : "text-purple-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {validationError && (
              <p className="font-inter text-xs text-coral-600 font-medium">
                {validationError}
              </p>
            )}
          </div>

          {/* Comment Field */}
          <div>
            <label className="mb-1.5 block font-sora text-xs font-bold tracking-wide text-purple-600/70">
              {readOnly ? "Your Comments" : "Feedback & Comments (Optional)"}
            </label>
            <textarea
              rows={4}
              readOnly={readOnly}
              value={comment}
              onChange={(e) => !readOnly && setComment(e.target.value)}
              placeholder={
                readOnly
                  ? "No comment provided."
                  : "How was your volunteering experience? What went well?"
              }
              className={`w-full rounded-xl border p-3 font-inter text-sm transition-all ${
                readOnly
                  ? "border-purple-100 bg-purple-50/20 text-purple-800/80 resize-none focus:outline-none"
                  : "border-purple-200 bg-purple-50/30 text-purple-900 placeholder:text-purple-600/30 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {readOnly ? (
              <Button type="button" variant="primary" onClick={handleClose}>
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Submit Review
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}