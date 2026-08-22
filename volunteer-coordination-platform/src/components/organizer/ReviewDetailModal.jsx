import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, X, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { formatDateTime } from "../../utils/activities";

export default function ReviewDetailModal({ review, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const { volunteer, rating = 0, comment, created_at, activityName } = review || {};

  return createPortal(
    <AnimatePresence>
      {isOpen && review && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div>
                <h3 className="font-sora text-lg font-extrabold text-purple-600">
                  Review Details
                </h3>
                <span className="inline-block rounded-md bg-purple-50 px-2.5 py-0.5 mt-1 font-sora text-xs font-semibold text-purple-600">
                  {activityName || "Volunteer Activity"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-purple-600/50 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Volunteer Info & Google-Style Rating */}
            <div className="my-5 flex items-center justify-between rounded-xl bg-purple-50/50 p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <Avatar
                  src={volunteer?.avatarUrl}
                  name={volunteer?.name || "Anonymous"}
                  size={48}
                />
                <div>
                  <p className="font-sora text-sm font-bold text-purple-600">
                    {volunteer?.name || "Anonymous Volunteer"}
                  </p>
                  {created_at && (
                    <p className="flex items-center gap-1 font-inter text-xs text-purple-600/50">
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(created_at)}
                    </p>
                  )}
                </div>
              </div>

              {/* Star Rating Display */}
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

            {/* Full Comment */}
            <div className="mb-6">
              <p className="mb-1 font-sora text-xs font-bold uppercase tracking-wider text-purple-600/50">
                Volunteer Feedback
              </p>
              <div className="rounded-xl border border-purple-100 bg-white p-4 font-inter text-sm leading-relaxed text-purple-800/80">
                "{comment}"
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}