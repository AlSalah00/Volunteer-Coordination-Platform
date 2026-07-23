import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  UserPlus,
  HeartHandshake,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/organizer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/organizer/activities", label: "Activities", icon: Sparkles },
  { to: "/organizer/recruit", label: "Recruit", icon: UserPlus },
  { to: "/organizer/reviews", label: "Reviews", icon: HeartHandshake },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const organization = {
    name: "Green Sprouts Initiative",
    logo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
  };


  const textVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.15 } },
    visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
  };

  return (
    <motion.aside
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="hidden lg:flex flex-col m-4 rounded-3xl bg-purple-600 p-4 sticky top-4 h-[calc(100vh-2rem)] shrink-0 overflow-hidden shadow-xl select-none"
    >

      <div className="flex items-center h-10 px-3.5 mb-6 font-fredoka text-xl font-bold text-purple-50 tracking-wide select-none">
        <span>B</span>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap"
            >
              enevolentia
            </motion.span>
          )}
        </AnimatePresence>
      </div>


      <button
        onClick={() => console.log("Navigate to settings/profile")}
        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-purple-800/40 text-left transition-colors mb-6 group cursor-pointer focus:outline-none"
      >
        <img
          src={organization.logo}
          alt={organization.name}
          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-2 ring-purple-200/30 group-hover:ring-purple-200 transition-all"
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
                {organization.name}
              </span>
              <span className="font-inter text-xs text-purple-200 truncate">
                Organizer Profile
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
      </nav>


      <div className="mt-auto pt-4">
        <div className="h-px bg-purple-800/30 mb-4 mx-2" />
        <button
          onClick={() => console.log("Log out triggered")}
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
  );
}
