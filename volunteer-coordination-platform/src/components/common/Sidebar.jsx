import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import { LogOut, Bell } from "lucide-react";

const textVariants = {
  hidden: { opacity: 0, x: -10, transition: { duration: 0.15 } },
  visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
};

export default function Sidebar({
  navItems = [],
  profileName = "User",
  avatarUrl = null,
  profileSubtext = "Profile",
  profileLink = "/",
  unreadNotificationCount = 0,
  onOpenNotifications,
  onLogout,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMobileMenuOpen(false);
    if (onLogout) onLogout();
  };

  const handleOpenNotifications = () => {
    setMobileMenuOpen(false);
    if (onOpenNotifications) onOpenNotifications();
  };

  return (
    <>
      {/* Mobile Navbar */}
      <header className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <nav className="w-full bg-purple-600 rounded-2xl px-5 py-3.5 shadow-xl shadow-purple-900/20 select-none">
          <div className="flex items-center justify-between">
            <span className="font-fredoka text-xl font-bold text-purple-50 tracking-wide">
              Benevolentia
            </span>

            <button
              className="flex flex-col justify-center gap-1.5 w-6 h-6 text-purple-200 hover:text-white transition-colors cursor-pointer focus:outline-none"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-full bg-current rounded-full origin-center"
              />
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-full bg-current rounded-full"
              />
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-full bg-current rounded-full origin-center"
              />
            </button>
          </div>

          {/* Mobile Dropdown Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="mobile-drawer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-3 border-t border-purple-500/30 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(profileLink);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50/10 text-left transition-colors cursor-pointer focus:outline-none"
                  >
                    <Avatar
                      src={avatarUrl}
                      name={profileName}
                      size={36}
                      className="shrink-0 ring-2 ring-purple-200/30"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-sora text-sm font-bold text-purple-50 truncate">
                        {profileName}
                      </span>
                      <span className="font-inter text-xs text-purple-200 truncate">
                        {profileSubtext}
                      </span>
                    </div>
                  </button>

                  <div className="h-px bg-purple-500/30 my-0.5" />

                  <div className="flex flex-col gap-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-sora text-sm font-bold transition-all ${
                            isActive
                              ? "bg-purple-50 text-purple-600 shadow-sm"
                              : "text-purple-50/80 hover:bg-purple-50/10 hover:text-purple-50"
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{label}</span>
                      </NavLink>
                    ))}

                    {/* Mobile Notifications Button */}
                    <button
                      type="button"
                      onClick={handleOpenNotifications}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl font-sora text-sm font-bold text-purple-50/80 hover:bg-purple-50/10 hover:text-purple-50 transition-all text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                          <Bell className="w-5 h-5" />
                          {unreadNotificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                              {unreadNotificationCount > 99
                                ? "99+"
                                : unreadNotificationCount}
                            </span>
                          )}
                        </div>
                        <span>Notifications</span>
                      </div>
                    </button>
                  </div>

                  <div className="h-px bg-purple-500/30 my-0.5" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-sora text-sm font-bold text-coral-50 hover:bg-coral-600/20 hover:text-amber-50 transition-all text-left cursor-pointer focus:outline-none"
                  >
                    <LogOut className="w-5 h-5 shrink-0 text-coral-50/80" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <motion.aside
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="hidden lg:flex flex-col m-4 rounded-3xl bg-purple-600 p-4 sticky top-4 h-[calc(100vh-2rem)] shrink-0 overflow-hidden shadow-xl select-none"
      >
        <div className="flex items-center h-10 px-3.5 mb-6 font-fredoka text-xl font-bold text-purple-50 tracking-wide select-none">
          <AnimatePresence mode="wait" initial={false}>
            {isExpanded ? (
              <motion.span
                key="full-wordmark"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                Benevolentia
              </motion.span>
            ) : (
              <motion.span
                key="single-letter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-5 text-center shrink-0"
              >
                B
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => navigate(profileLink)}
          className="flex items-center gap-3 px-1 py-2 rounded-2xl hover:bg-purple-50/10 text-left transition-colors mb-6 group cursor-pointer focus:outline-none w-full"
        >
          <Avatar
            src={avatarUrl}
            name={profileName}
            size={40}
            className="shrink-0 ring-2 ring-purple-200/30 group-hover:ring-purple-200 transition-all"
          />

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col min-w-0"
              >
                <span className="font-sora text-sm font-bold text-purple-50 truncate">
                  {profileName}
                </span>
                <span className="font-inter text-xs text-purple-200 truncate">
                  {profileSubtext}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="h-px bg-purple-800/30 mb-6 mx-2" />

        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3.5 py-3 rounded-xl font-sora text-sm font-bold transition-all duration-200 group relative ${
                  isActive
                    ? "bg-purple-50 text-purple-600 shadow-sm"
                    : "text-purple-50/80 hover:bg-purple-50/10 hover:text-purple-50"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {/* Desktop Notifications Button */}
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="w-full flex items-center gap-4 px-3.5 py-3 rounded-xl font-sora text-sm font-bold transition-all duration-200 text-purple-50/80 hover:bg-purple-50/10 hover:text-purple-50 text-left cursor-pointer focus:outline-none"
          >
            <div className="relative shrink-0">
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </div>
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="whitespace-nowrap"
                >
                  Notifications
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        <div className="mt-auto pt-4">
          <div className="h-px bg-purple-800/30 mb-4 mx-2" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3.5 py-3 rounded-xl font-sora text-sm font-bold text-coral-50 hover:bg-coral-600/20 hover:text-amber-50 transition-all duration-200 group cursor-pointer focus:outline-none"
          >
            <LogOut className="w-5 h-5 shrink-0 text-coral-50/80 group-hover:text-coral-50" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
