import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Mail,
  Phone,
  Pencil,
  KeyRound,
  Trash2,
  Sparkles,
  Wrench,
  Heart,
  Calendar,
  MapPin,
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

function PillTag({
  label,
  colorClass = "bg-purple-50 text-purple-600 border-purple-200/60",
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-sora text-xs font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
}

function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function VolunteerProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const { volunteerProfile, loadingProfile } = useOutletContext();

  if (loadingProfile) {
    return (
      <p className="font-inter text-sm text-purple-600/60">
        Loading profile...
      </p>
    );
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!volunteerProfile?.email) {
      showToast({
        type: "error",
        message: "No email address associated with this profile.",
      });
      return;
    }

    setIsSendingReset(true);
    const { error: resetError } = await sendPasswordResetEmail(
      volunteerProfile.email,
    );
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

  if (error || !volunteerProfile) {
    return (
      <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
        {error || "Oh no! We couldn't find your profile."}
      </div>
    );
  }

  const fullName =
    [volunteerProfile.first_name, volunteerProfile.last_name]
      .filter(Boolean)
      .join(" ") || "Volunteer";

  // Helper to format availability regardless of whether it's stored as an Array or Object
  const renderAvailability = () => {
    const avail = volunteerProfile.availability;
    if (!avail) return null;

    // Standard jsonb object format
    if (
      typeof avail === "object" &&
      !Array.isArray(avail) &&
      Object.keys(avail).length > 0
    ) {
      // Map strictly through DAYS_OF_WEEK to enforce chronological ordering
      const activeSlots = DAYS_OF_WEEK.filter((day) => {
        const slot = avail[day];
        return slot && (typeof slot === "object" ? slot.active : Boolean(slot));
      }).map((day) => {
        const slot = avail[day];
        return {
          day,
          start: slot.start ? formatTime12h(slot.start) : null,
          end: slot.end ? formatTime12h(slot.end) : null,
        };
      });

      if (activeSlots.length > 0) {
        return (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {activeSlots.map(({ day, start, end }, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-purple-200/60 bg-white px-4 py-3"
              >
                <span className="font-sora text-sm font-bold text-purple-600">
                  {day}
                </span>
                <span className="font-inter text-xs font-semibold text-purple-600">
                  {start && end ? `${start} – ${end}` : "Available"}
                </span>
              </div>
            ))}
          </div>
        );
      }
    }
    return (
      <p className="font-inter text-sm text-purple-600/50">
        No availability set yet.
      </p>
    );
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Banner + Avatar + Header Info */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-200/60 bg-white">
        <div className="relative h-36 overflow-hidden bg-purple-600">
        </div>

        <div className="absolute left-8 top-24">
          <Avatar
            src={volunteerProfile?.avatar_url}
            name={fullName}
            size={112}
            className="border-4 border-white shadow-md"
          />
        </div>

        <div className="px-8 pb-6 pt-4 sm:pl-40">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-sora text-2xl font-extrabold text-purple-600">
              {fullName}
            </h1>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 border border-amber-200/60">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-sora text-xs font-bold text-amber-700">
                Level {volunteerProfile.level} – {volunteerProfile.title}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/volunteer/profile/edit")}
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

      {/* Bio / About */}
      {volunteerProfile?.bio && (
        <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
          <h2 className="mb-3 font-sora text-lg font-extrabold text-purple-600">
            About Me
          </h2>
          <p className="font-inter text-sm leading-relaxed text-purple-600/70">
            {volunteerProfile.bio}
          </p>
        </section>
      )}

      {/* Skills */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Skills
          </h2>
        </div>
        {volunteerProfile.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {volunteerProfile.skills.map((skill, index) => (
              <PillTag key={index} label={skill} />
            ))}
          </div>
        ) : (
          <p className="font-inter text-sm text-purple-600/50">
            No skills added yet.
          </p>
        )}
      </section>

      {/* Interests */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Interests & Causes
          </h2>
        </div>
        {volunteerProfile.interests?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {volunteerProfile.interests.map((interest, index) => (
              <PillTag key={index} label={interest} />
            ))}
          </div>
        ) : (
          <p className="font-inter text-sm text-purple-600/50">
            No interests added yet.
          </p>
        )}
      </section>

      {/* Availability */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Availability
          </h2>
        </div>
        {renderAvailability()}
      </section>

      {/* Contact Info */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-sora text-lg font-extrabold text-purple-600">
          Contact Info
        </h2>
        <div className="flex flex-col gap-4">
          <InfoRow icon={Mail} label={volunteerProfile.email} />
          {volunteerProfile.contact_number && (
            <InfoRow icon={Phone} label={volunteerProfile.contact_number} />
          )}
          {volunteerProfile.location && (
            <InfoRow icon={MapPin} label={volunteerProfile.location} />
          )}
        </div>
      </section>

      {/* Account Deletion Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        variant="danger"
        title="Delete your account?"
        description="This permanently deletes your volunteer profile, sign-ups, and achievements. This action cannot be undone."
        confirmLabel="Delete Account"
        isLoading={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
