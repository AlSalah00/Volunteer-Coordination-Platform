import { ChevronDown } from "lucide-react";

export default function SelectField({ label, id, options, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-inter text-sm font-medium text-purple-600/80">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          className="w-full appearance-none rounded-md border border-purple-600/20 bg-purple-50/40 px-4 py-2.5 pr-10
                     font-inter text-sm text-purple-800
                     focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600
                     transition-colors cursor-pointer"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/50" />
      </div>
    </div>
  );
}
