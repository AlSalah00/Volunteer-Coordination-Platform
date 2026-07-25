import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Hash, Star, Pencil, KeyRound, Trash2, BadgeCheck } from "lucide-react";
import Avatar from "../../components/common/Avatar";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getOrganizerProfile } from "../../services/profile";
import { sendPasswordResetEmail } from "../../services/auth";
import { useToast } from "../../contexts/ToastContext";

function InfoRow({ icon: Icon, label }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-inter text-sm text-purple-600/80">{label}</span>
    </div>
  );
}

export default function OrgProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getOrganizerProfile().then(({ data, error: fetchError }) => {
      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || "Couldn't load your profile.");
      } else {
        setProfile(data);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetPassword = async () => {
    if (!profile?.email) {
      showToast({ type: "error", message: "No email address associated with this profile." });
      return;
    }

    setIsSendingReset(true);
    const { error: resetError } = await sendPasswordResetEmail(profile.email);
    setIsSendingReset(false);

    showToast(
      resetError
        ? { type: "error", message: "Couldn't send the reset email. Try again." }
        : { type: "success", message: "Password reset email sent." }
    );
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    showToast({ type: "error", message: "Account deletion isn't wired up yet." });
  };

  if (loading) {
    return <p className="font-inter text-sm text-purple-600/60">Loading...</p>;
  }

  if (error || !profile) {
    return (
      <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
        {error || "Profile not found."}
      </div>
    );
  }

  const isVerified = profile.verification_status === "verified";

  return (
    <div className="max-w-3xl">
      {/* Banner + avatar + actions */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-purple-200/60 bg-white">
        <div className="relative h-36 overflow-hidden bg-purple-600">
          <div
            aria-hidden="true"
            className="absolute -bottom-16 -left-16 h-64 w-64 bg-purple-200/30 blur-2xl"
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          />
        </div>

        <div className="absolute left-8 top-24">
          <Avatar
            src={profile.avatar_url}
            name={profile.org_name}
            size={112}
            className="border-4 border-white shadow-md"
          />
        </div>

        <div className="px-8 pb-6 pt-4 sm:pl-40">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-sora text-2xl font-extrabold text-purple-600">
              {profile.org_name}
            </h1>
            {isVerified && (
              <span title="Verified organization">
                <BadgeCheck className="h-5 w-5 text-teal-600" />
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {profile.average_rating != null ? (
              <span className="flex items-center gap-1.5 font-inter text-sm text-purple-600/80">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-sora font-bold text-purple-600">
                  {profile.average_rating.toFixed(1)}
                </span>
              </span>
            ) : (
              <span className="font-inter text-sm text-purple-600/50">No ratings yet</span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/organizer/profile/edit")}
              className="flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-sora text-sm font-bold text-purple-50 transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isSendingReset}
              className="flex items-center gap-2 rounded-md border-2 border-purple-600/20 px-5 py-2.5 font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {isSendingReset ? "Sending..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 rounded-md px-5 py-2.5 font-sora text-sm font-bold text-coral-600 transition-colors hover:bg-coral-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <section className="mb-6 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
          <h2 className="mb-3 font-sora text-lg font-extrabold text-purple-600">About</h2>
          <p className="font-inter text-sm leading-relaxed text-purple-600/70">{profile.bio}</p>
        </section>
      )}

      {/* Contact info */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-sora text-lg font-extrabold text-purple-600">Contact Info</h2>
        <div className="flex flex-col gap-4">
          <InfoRow icon={Mail} label={profile.email} />
          {profile.contact_number && <InfoRow icon={Phone} label={profile.contact_number} />}
          {profile.address && <InfoRow icon={MapPin} label={profile.address} />}
          {profile.registration_number && (
            <InfoRow icon={Hash} label={`Reg. No. ${profile.registration_number}`} />
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={showDeleteModal}
        variant="danger"
        title="Delete your account?"
        description="This permanently deletes your organization profile and everything tied to it. This can't be undone."
        confirmLabel="Delete Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}