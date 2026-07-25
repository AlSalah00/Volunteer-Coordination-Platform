import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { STATUS_META } from "./StatusBadge";

const UPDATABLE_STATUSES = ["active", "completed", "cancelled"];

export default function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = STATUS_META[status] ?? STATUS_META.upcoming;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 font-sora text-sm font-bold
                    transition-colors cursor-pointer ${current.bg} ${current.text}`}
      >
        {current.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-purple-200/60 bg-white shadow-lg">
          {UPDATABLE_STATUSES.map((value) => {
            const meta = STATUS_META[value];
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-inter text-sm
                           text-purple-600/80 transition-colors hover:bg-purple-50 cursor-pointer"
              >
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
