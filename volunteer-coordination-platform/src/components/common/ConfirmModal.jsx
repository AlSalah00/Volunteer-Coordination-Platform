import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, HelpCircle } from "lucide-react";

const VARIANTS = {
  default: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    icon: HelpCircle,
    confirmClass: "bg-purple-600 hover:bg-purple-800 text-purple-50",
  },
  danger: {
    iconBg: "bg-coral-50",
    iconColor: "text-coral-600",
    icon: AlertTriangle,
    confirmClass: "bg-coral-600 hover:bg-coral-600/90 text-white",
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  const confirmButtonRef = useRef(null);
  const meta = VARIANTS[variant] ?? VARIANTS.default;
  const Icon = meta.icon;

  // Locks background scroll, focuses the confirm button, and lets Escape
  // close the modal.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-purple-800/40 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${meta.iconBg}`}
            >
              <Icon className={`h-5 w-5 ${meta.iconColor}`} />
            </div>

            <h2
              id="confirm-modal-title"
              className={`font-sora text-lg font-extrabold text-purple-600 ${
                description ? "mb-1.5" : "mb-6"
              }`}
            >
              {title}
            </h2>

            {description && (
              <p className="mb-6 font-inter text-sm leading-relaxed text-purple-600/70">
                {description}
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="cursor-pointer rounded-md px-4 py-2.5 font-sora text-sm font-bold text-purple-600
                           transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`cursor-pointer rounded-md px-5 py-2.5 font-sora text-sm font-bold transition-all
                            duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60
                            disabled:active:scale-100 ${meta.confirmClass}`}
              >
                {isLoading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
