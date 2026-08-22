import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Hash,
  Star,
  Pencil,
  KeyRound,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import Avatar from "../../components/common/Avatar";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  sendPasswordResetEmail,
  deleteAccount,
  signOut,
} from "../../services/auth";
import { useToast } from "../../contexts/ToastContext";
import Button from "../../components/common/Button";

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

  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const { organizerProfile, isVerified, loadingProfile, refetchProfile } =
    useOutletContext();

  if (loadingProfile) {
    return (
      <p className="font-inter text-sm text-purple-600/60">
        Loading profile...
      </p>
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!organizerProfile?.email) {
      showToast({
        type: "error",
        message: "No email address associated with this profile.",
      });
      return;
    }

    setIsSendingReset(true);
    const { error: resetError } = await sendPasswordResetEmail(organizerProfile.email);
    setIsSendingReset(false);

    showToast(
      resetError
        ? {
            type: "error",
            message: "Couldn't send the reset email. Try again.",
          }
        : { type: "success", message: "Password reset email sent." },
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    const { error: deleteError } = await deleteAccount();

    if (deleteError) {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
      showToast({
        type: "error",
        message: "Couldn't delete your account. Try again.",
      });
      return;
    }

    await signOut();
    navigate("/");
  };

  if (error || !organizerProfile) {
    return (
      <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
        {error || "Oh no! We couldn't find your profile."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Banner + avatar + actions */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-purple-200/60 bg-white">
        <div className="relative h-36 overflow-hidden bg-purple-600">
        </div>

        <div className="absolute left-8 top-24">
          <Avatar
            src={organizerProfile?.avatar_url}
            name={organizerProfile?.org_name}
            size={112}
            className="border-4 border-white shadow-md"
          />
        </div>

        <div className="px-8 pb-6 pt-4 sm:pl-40">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-sora text-2xl font-extrabold text-purple-600">
              {organizerProfile?.org_name}
            </h1>
            {isVerified && (
              <span title="Verified organization">
                <BadgeCheck className="h-5 w-5 text-teal-600" />
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {organizerProfile?.average_rating != null ? (
              <span className="flex items-center gap-1.5 font-inter text-sm text-purple-600/80">
                <Star className="h-4 w-4 fill-purple-600 text-purple-600" />
                <span className="font-sora font-bold text-purple-600">
                  {organizerProfile.average_rating
                  ? `${Number(organizerProfile.average_rating).toFixed(1)} Rating`
                  : "New Host"}
                </span>
              </span>
            ) : (
              <span className="font-inter text-sm text-purple-600/50">
                No ratings yet
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/organizer/profile/edit")}
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>

            <Button
              onClick={handleResetPassword}
              disabled={isSendingReset}
              variant="secondary"
            >
              <KeyRound className="h-4 w-4" />
              {isSendingReset ? "Sending..." : "Reset Password"}
            </Button>

            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="danger"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Bio */}
      {organizerProfile?.bio && (
        <section className="mb-6 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
          <h2 className="mb-3 font-sora text-lg font-extrabold text-purple-600">
            About Organization
          </h2>
          <p className="font-inter text-sm leading-relaxed text-purple-600/70">
            {organizerProfile.bio}
          </p>
        </section>
      )}

      {/* Contact info */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-sora text-lg font-extrabold text-purple-600">
          Contact & Info
        </h2>
        <div className="flex flex-col gap-4">
          <InfoRow icon={Mail} label={organizerProfile.email} />
          {organizerProfile.contact_number && (
            <InfoRow icon={Phone} label={organizerProfile.contact_number} />
          )}
          {organizerProfile.address && <InfoRow icon={MapPin} label={organizerProfile.address} />}
          {organizerProfile.registration_number && (
            <InfoRow
              icon={Hash}
              label={`Reg. No. ${organizerProfile.registration_number}`}
            />
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={showDeleteModal}
        variant="danger"
        title="Delete your account?"
        description="This permanently deletes your organization profile and everything tied to it. This can't be undone."
        confirmLabel="Delete Account"
        isLoading={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
