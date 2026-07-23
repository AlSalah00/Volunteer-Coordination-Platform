/**
 * Wraps any button-like action that should be disabled pre-verification.
 *
 *   <LockableButton locked={!isVerified} onClick={handlePost}>
 *     Post Opportunity
 *   </LockableButton>
 */
export default function LockableButton({
  locked,
  lockedMessage = "Unlocks once you're verified",
  children,
  className = "",
  ...props
}) {
  return (
    <span className="relative inline-flex group">
      <button
        disabled={locked}
        className={`${className} ${
          locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        {...props}
      >
        {children}
      </button>

      {locked && (
        <span
          className="pointer-events-none absolute left-1/2 -top-9 -translate-x-1/2 whitespace-nowrap
                     rounded-md bg-purple-800 px-3 py-1.5 font-inter text-xs text-purple-50
                     opacity-0 transition-opacity group-hover:opacity-100"
        >
          {lockedMessage}
        </span>
      )}
    </span>
  );
}
