export default function FormField({ label, id, type = "text", className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-inter text-sm font-medium text-purple-600/80">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="w-full rounded-md border border-purple-600/20 bg-purple-50/40 px-4 py-2.5
                   font-inter text-sm text-purple-800 placeholder:text-purple-600/40
                   focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600
                   transition-colors"
        {...props}
      />
    </div>
  );
}
