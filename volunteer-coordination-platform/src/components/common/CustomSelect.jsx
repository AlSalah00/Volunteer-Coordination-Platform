import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",
  triggerClassName,
  menuClassName,
  align = "left",
  renderOption,
  selectedOption: customSelectedOption, // Optional override
}) {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Use the override if provided, otherwise find in options
  const selectedOption =
    customSelectedOption ?? options.find((opt) => opt.value === value);

  const defaultTriggerClass = `flex w-full items-center justify-between rounded-md border bg-purple-50/40 px-4 py-2.5 font-inter text-sm text-purple-800 transition-colors cursor-pointer text-left focus:outline-none ${
    open
      ? "border-purple-600 ring-2 ring-purple-600/30"
      : "border-purple-600/20 hover:border-purple-600/40"
  }`;

  const defaultMenuClass = `absolute ${
    align === "right" ? "right-0" : "left-0 right-0"
  } z-30 mt-1 max-h-60 overflow-auto rounded-md border border-purple-600/20 bg-white p-1 shadow-lg font-inter text-sm`;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClassName ?? defaultTriggerClass}
      >
        <span className="truncate">
          {selectedOption
            ? renderOption
              ? renderOption(selectedOption)
              : selectedOption.label
            : placeholder}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div role="listbox" className={menuClassName ?? defaultMenuClass}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-purple-100 font-semibold text-purple-900"
                    : "text-purple-800 hover:bg-purple-50"
                }`}
              >
                {renderOption ? renderOption(option) : option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}