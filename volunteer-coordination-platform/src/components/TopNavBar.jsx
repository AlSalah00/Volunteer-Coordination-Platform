import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "How It Works", target: "how-it-works" },
  { label: "Mission",      target: "mission"       },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-left pointer-events-none">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl bg-purple-600 rounded-2xl px-6 py-4
                   shadow-lg shadow-purple-800/30 pointer-events-auto"
      >
        {/* Main row */}
        <div className="flex items-center justify-between">

          {/* Wordmark clicks scroll back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-semibold text-purple-300
                       hover:text-white transition-colors duration-200
                       leading-none cursor-pointer"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Benevolentia
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ label, target }) => (
              <button
                key={target}
                onClick={() => scrollTo(target)}
                className="text-sm font-semibold text-purple-300
                           hover:text-white transition-colors duration-200
                           cursor-pointer"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile animated hamburger / × */}
          <button
            className="md:hidden flex flex-col justify-center gap-1.5
                       w-6 h-6 text-purple-300 hover:text-white
                       transition-colors duration-200 cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-0.5 w-full bg-current rounded-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-full bg-current rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-0.5 w-full bg-current rounded-full origin-center"
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-4 mt-4 pt-4
                              border-t border-purple-300/20 pb-1">
                {links.map(({ label, target }) => (
                  <button
                    key={target}
                    onClick={() => scrollTo(target)}
                    className="text-sm font-semibold text-purple-300
                               hover:text-white transition-colors duration-200
                               text-left cursor-pointer w-fit"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}