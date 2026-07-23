import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/auth/AuthLayout";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import RoleToggle from "../components/auth/RoleToggle";
import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import OAuthButtons from "../components/auth/OAuthButtons";
import { signIn } from "../services/auth";
import { getCurrentProfile } from "../services/profile";
import { getDashboardRoute } from "../utils/navigation";
import { getFriendlyAuthError } from "../utils/authErrors";

const copy = {
  volunteer: {
    headline: "Welcome Back.",
    subtext: "Your community's been waiting. Let's pick up where you left off.",
    tagline: "Good to see you again.",
  },
  organizer: {
    headline: "Good To See You.",
    subtext: "Check in on your opportunities and the volunteers showing up for you.",
    tagline: "Let's see who needs a hand today.",
  },
};

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const role = searchParams.get("role") === "organizer" ? "organizer" : "volunteer";

  const handleRoleChange = (nextRole) => setSearchParams({ role: nextRole });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const { error: signInError } = await signIn({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (signInError) throw signInError;

      const { data: profile, error: profileError } = await getCurrentProfile();
      if (profileError) throw profileError;

      const redirectTo = location.state?.from?.pathname || getDashboardRoute(profile.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      sidePanel={
        <AuthSidePanel
          panelKey={role}
          headline={copy[role].headline}
          subtext={copy[role].subtext}
          switchPrompt="New here?"
          switchLabel="Create an account"
          switchTo={`/signup?role=${role}`}
        />
      }
      roleToggle={<RoleToggle value={role} onChange={handleRoleChange} />}
    >
      <h2 className="font-sora text-2xl font-extrabold text-purple-600 mb-1">Log In</h2>
      <p className="font-inter text-sm text-purple-600/60 mb-8">{copy[role].tagline}</p>

      <AnimatePresence mode="wait">
        <motion.form
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="rounded-md bg-coral-50 border border-coral-600/20 px-4 py-3 text-sm text-coral-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md bg-purple-600 py-3 font-sora text-sm font-bold text-purple-50
                       transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          {role === "volunteer" && <OAuthButtons actionLabel="Log in" />}
        </motion.form>
      </AnimatePresence>
    </AuthLayout>
  );
}