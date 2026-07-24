import { motion } from "framer-motion";

const TYPES = [
  { value: "in_person", label: "In-Person" },
  { value: "online", label: "Online" },
];

export default function ActivityTypeToggle({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-inter text-sm font-medium text-purple-600/80">Activity Type</span>

      <div
        role="radiogroup"
        aria-label="Activity type"
        className="inline-flex w-fit rounded-xl bg-purple-50 p-1"
      >
        {TYPES.map((type) => {
          const isActive = value === type.value;
          return (
            <label
              key={type.value}
              className={`relative cursor-pointer rounded-lg px-5 py-2 font-sora text-sm font-bold transition-colors ${
                isActive ? "text-purple-50" : "text-purple-600 hover:text-purple-800"
              }`}
            >
              <input
                type="radio"
                name="activityType"
                value={type.value}
                checked={isActive}
                onChange={() => onChange(type.value)}
                className="sr-only"
              />
              {isActive && (
                <motion.span
                  layoutId="activity-type-pill"
                  className="absolute inset-0 rounded-lg bg-purple-600 shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{type.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
