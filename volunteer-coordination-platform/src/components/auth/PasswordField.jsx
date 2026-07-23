import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({ label = "Password", id = "password", className = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-inter text-sm font-medium text-purple-600/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          className="w-full rounded-md border border-purple-600/20 bg-purple-50/40 px-4 py-2.5 pr-11
                     font-inter text-sm text-purple-800 placeholder:text-purple-600/40
                     focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600
                     transition-colors"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600/50 hover:text-purple-600 cursor-pointer"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
