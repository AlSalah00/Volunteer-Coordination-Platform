import { motion } from "framer-motion";

const roles = [
  { key: "volunteer", label: "Volunteer" },
  { key: "organizer", label: "Organizer" },
];

export default function RoleToggle({ value, onChange, className = "" }) {
  return (
    <div
      role="tablist"
      aria-label="Choose account type"
      className={`inline-flex bg-purple-50 rounded-xl p-1 shadow-inner ${className}`}
    >
      {roles.map((role) => {
        const isActive = value === role.key;
        return (
          <button
            key={role.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(role.key)}
            className={`relative px-5 py-2 rounded-lg font-sora text-sm font-bold transition-colors cursor-pointer ${
              isActive ? "text-purple-50" : "text-purple-600 hover:text-purple-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="role-toggle-pill"
                className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}
