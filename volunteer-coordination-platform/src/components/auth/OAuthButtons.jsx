import GoogleIcon from "../../assets/google.svg?react";
import { signInWithGoogle } from "../../services/auth";
import { useState } from "react";

export default function OAuthButtons({ actionLabel = "Sign up" }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle("volunteer");
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-purple-600/15" />
        <span className="font-sora text-xs font-bold uppercase tracking-widest text-purple-600/40">
          or
        </span>
        <div className="h-px flex-1 bg-purple-600/15" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-md border-2 border-purple-600/15 bg-purple-50 px-6 py-2.5
                     font-sora text-sm font-bold text-purple-600
                     transition-all duration-200 hover:bg-purple-50/85 hover:border-purple-600/30
                     active:scale-95 cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon className="size-5" />
          {loading ? "Connecting..." : `${actionLabel} with Google`}
        </button>
      </div>
    </div>
  );
}
