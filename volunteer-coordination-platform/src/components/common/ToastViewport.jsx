import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

const VARIANTS = {
  success: {
    bg: "bg-teal-50",
    border: "border-teal-400/30",
    text: "text-teal-600",
    icon: CheckCircle2,
  },
  error: {
    bg: "bg-coral-50",
    border: "border-coral-600/20",
    text: "text-coral-600",
    icon: XCircle,
  },
};

export default function ToastViewport({ toasts, onDismiss }) {
  return createPortal(
    <div className="pointer-events-none fixed left-1/2 top-6 z-100 flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const meta = VARIANTS[toast.type] ?? VARIANTS.success;
          const Icon = meta.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${meta.bg} ${meta.border}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${meta.text}`} />
              <p className={`flex-1 font-inter text-sm font-medium ${meta.text}`}>
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss"
                className={`shrink-0 cursor-pointer rounded-full p-0.5 transition-colors hover:bg-black/5 ${meta.text}`}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}
