import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthSidePanel({
  panelKey,
  headline,
  subtext,
  switchPrompt,
  switchLabel,
  switchTo,
}) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full max-w-2/5 rounded-3xl bg-purple-600 p-10 overflow-hidden">
      {/* Decorative blob, bottom-left */}

      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-200/30 blur-2xl"
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-12 -left-12 w-60 h-60 bg-purple-200/70"
        style={{ borderRadius: "58% 42% 35% 65% / 55% 35% 65% 45%" }}
      />

      {/* Wordmark */}
      <div className="relative z-10 font-fredoka text-2xl font-semibold text-purple-50 tracking-wide">
        <Link to="/" className="hover:text-purple-100 transition-colors">
          Benevolentia
        </Link>
      </div>

      {/* Headline / subtext, sits in the empty middle space */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h1 className="font-sora text-3xl font-extrabold text-purple-50 leading-tight mb-4">
              {headline}
            </h1>
            <p className="font-inter text-sm text-purple-50/75 leading-relaxed max-w-xs">
              {subtext}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Switch link */}
      <div className="relative z-10 font-inter text-sm text-purple-50/85">
        {switchPrompt}{" "}
        <Link
          to={switchTo}
          className="font-semibold text-purple-50 underline underline-offset-4 decoration-purple-200/60 hover:decoration-purple-50 transition-colors"
        >
          {switchLabel} →
        </Link>
      </div>
    </div>
  );
}
