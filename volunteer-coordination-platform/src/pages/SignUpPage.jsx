import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import RoleToggle from "../components/auth/RoleToggle";
import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import Button from "../components/common/Button";
import OAuthButtons from "../components/auth/OAuthButtons";
import { signUpVolunteer, signUpOrganizer } from "../services/auth";
import { getDashboardRoute } from "../utils/navigation";
import { getFriendlyAuthError } from "../utils/authErrors";

const copy = {
  volunteer: {
    headline: "Small Acts. Big Impact.",
    subtext: "Join volunteers and organizations creating positive change, together.",
    tagline: "Takes less than a minute, promise.",
  },
  organizer: {
    headline: "Rally Your People.",
    subtext: "Post your cause and meet volunteers ready to help make it happen.",
    tagline: "Set up your organization and start posting opportunities.",
  },
};

function AgreementCheckbox() {
  return (
    <label className="flex items-start gap-2.5 font-inter text-xs text-purple-600/70 leading-relaxed">
      <input
        type="checkbox"
        name="agreeTerms"
        required
        className="mt-0.5 w-4 h-4 rounded border-purple-600/30 text-purple-600 focus:ring-purple-600/40 cursor-pointer accent-purple-600"
      />
      <span>
        I agree to the{" "}
        <a href="/privacy" className="font-semibold text-purple-600 hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" className="font-semibold text-purple-600 hover:underline">
          Terms of Use
        </a>
      </span>
    </label>
  );
}

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const role = searchParams.get("role") === "organizer" ? "organizer" : "volunteer";

  const handleRoleChange = (nextRole) => setSearchParams({ role: nextRole });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const result =
        role === "volunteer"
          ? await signUpVolunteer({
              firstName: formData.get("firstName"),
              lastName: formData.get("lastName"),
              email: formData.get("email"),
              password: formData.get("password"),
            })
          : await signUpOrganizer({
              orgName: formData.get("orgName"),
              email: formData.get("email"),
              address: formData.get("address"),
              registrationNumber: formData.get("regNumber"),
              password: formData.get("password"),
            });

      if (result.error) throw result.error;

      navigate(getDashboardRoute(role), { replace: true });
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
          switchPrompt="Already got an account?"
          switchLabel="Log in"
          switchTo={`/login?role=${role}`}
        />
      }
      roleToggle={<RoleToggle value={role} onChange={handleRoleChange} />}
    >
      <h2 className="font-sora text-2xl font-extrabold text-purple-600 mb-1">Create Account</h2>
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
          {role === "volunteer" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="firstName"
                  label="First name"
                  placeholder="Mohamed"
                  autoComplete="given-name"
                  required
                />
                <FormField
                  id="lastName"
                  label="Last name"
                  placeholder="Rahman"
                  autoComplete="family-name"
                  required
                />
              </div>
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              <AgreementCheckbox />
            </>
          ) : (
            <>
              <FormField
                id="orgName"
                label="Organization name"
                placeholder="Development for All"
                autoComplete="organization"
                required
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="hello@yourorg.org"
                autoComplete="email"
                required
              />
              <FormField
                id="address"
                label="Address"
                placeholder="Street, city, state"
                autoComplete="street-address"
                required
              />
              <FormField
                id="regNumber"
                label="Registration number"
                placeholder="e.g. PPM-001-XX-XXXXXXX"
                required
              />
              <PasswordField
                id="password"
                label="Password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              <AgreementCheckbox />

              <div className="flex gap-2.5 rounded-md bg-amber-50 border border-amber-400/30 px-3.5 py-3 font-inter text-xs text-amber-800 leading-relaxed">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  We'll take a quick look at your registration details before your opportunities
                  go live. Feel free to explore the platform in the meantime.
                </span>
              </div>
            </>
          )}

          {error && (
            <div className="rounded-md bg-coral-50 border border-coral-600/20 px-4 py-3 text-sm text-coral-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full py-3"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          {role === "volunteer" && <OAuthButtons actionLabel="Sign up" />}
        </motion.form>
      </AnimatePresence>
    </AuthLayout>
  );
}