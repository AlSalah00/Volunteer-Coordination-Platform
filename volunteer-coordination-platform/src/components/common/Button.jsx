import clsx from "clsx";

const variants = {
  primary:
    "bg-purple-600 text-purple-50 hover:bg-purple-800 active:scale-95",

  secondary:
    "border-2 border-purple-600/20 text-purple-600 hover:bg-purple-50 active:scale-95",

  danger:
    "border-2 border-coral-600/20 text-coral-600 hover:bg-coral-50 active:scale-95",

  cancel:
    "rounded-md px-5 py-2.5 font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer",  
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        // Shared styles
        "flex items-center justify-center gap-2 rounded-md px-5 py-2.5",
        "font-sora text-sm font-bold",
        "transition-all duration-200",
        "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}