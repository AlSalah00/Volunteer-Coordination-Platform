import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getDashboardRoute } from "../utils/navigation";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const role = searchParams.get("role") || "volunteer";

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        localStorage.setItem("oauth_role_fallback", role);
        subscription.unsubscribe(); 
        navigate(getDashboardRoute(role), { replace: true });
      }
    });

    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(getDashboardRoute(role), { replace: true });
      } else {
        console.error("Auth callback timed out or failed to extract session.");
        navigate("/login?error=timeout", { replace: true });
      }
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 font-inter text-sm text-purple-600 font-medium">Completing secure sign in...</p>
      </div>
    </div>
  );
}