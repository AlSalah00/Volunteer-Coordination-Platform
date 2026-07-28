import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AuthLayout from "../components/auth/AuthLayout";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import PasswordField from "../components/auth/PasswordField";
import { updatePassword } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getDashboardRoute } from "../utils/navigation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || session) {
          setIsRecoverySession(true);
        }
        setCheckingSession(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoverySession(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message || "Something went wrong.");
      return;
    }

    showToast({ type: "success", message: "Password updated successfully!" });
    navigate("/login", { replace: true });
  };

  if (checkingSession) {
    return <p className="p-10 font-inter text-sm text-purple-600/60">Verifying reset link...</p>;
  }

  if (!isRecoverySession) {
    return (
      <AuthLayout
        sidePanel={
          <AuthSidePanel
            panelKey="invalid"
            headline="Link Expired."
            subtext="Password reset links only work once, and only for a little while."
            switchPrompt="Need a new one?"
            switchLabel="Back to login"
            switchTo="/login"
          />
        }
        roleToggle={null}
      >
        <h2 className="mb-1 font-sora text-2xl font-extrabold text-purple-600">
          This link isn't valid
        </h2>
        <p className="font-inter text-sm text-purple-600/60">
          It may have expired or already been used. Request a fresh one from the login page.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      sidePanel={
        <AuthSidePanel
          panelKey="reset"
          headline="Set A New Password."
          subtext="Make it something you'll remember. You'll use it every time you log in."
          switchPrompt="Remembered it after all?"
          switchLabel="Log in"
          switchTo="/login"
        />
      }
      roleToggle={null}
    >
      <h2 className="mb-1 font-sora text-2xl font-extrabold text-purple-600">New Password</h2>
      <p className="mb-8 font-inter text-sm text-purple-600/60">Choose something secure.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PasswordField
          id="password"
          label="New password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="Type it again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-md bg-purple-600 py-3 font-sora text-sm font-bold text-purple-50 transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
