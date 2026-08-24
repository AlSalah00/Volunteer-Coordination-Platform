import { Clock } from "lucide-react";

export default function VerificationBanner() {
  return (
    <div className="mx-6 mt-6 lg:mx-10 lg:mt-8 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-400/30 px-5 py-3.5">
      <Clock className="w-5 h-5 text-amber-800 shrink-0" />
      <p className="font-inter text-sm text-amber-800 leading-relaxed">
        We're still reviewing your registration details. This usually doesn't take long.
        Feel free to look around; publishing activities and other features will
        unlock once you're verified.
      </p>
    </div>
  );
}
