import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Plus, X, Trash2, Calendar, Wrench, Heart, User, MapPin } from "lucide-react";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import AvatarUploadField from "../../components/common/AvatarUploadField";
import { useToast } from "../../contexts/ToastContext";
import { updateVolunteerProfile } from "../../services/profile";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm = {
  avatar: undefined, // undefined = unchanged, File = new upload, null = removed
  existingAvatarUrl: null,
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  contactNumber: "",
  location: "",
  skills: [],
  interests: [],
  availability: {}, // e.g. { Sunday: { active: true, start: "10:00", end: "15:00" } }
};

// --- Helper Component for Dynamic Tag Inputs ---
function TagInput({ label, tags, onAddTag, onRemoveTag, placeholder, colorTheme = "purple" }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddTag(inputValue.trim());
        setInputValue("");
      }
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue("");
    }
  };

  const tagStyles =
    colorTheme === "coral"
      ? "bg-coral-50 text-coral-600 border-coral-200/60"
      : "bg-purple-50 text-purple-600 border-purple-200/60";

  return (
    <div>
      <label className="mb-2 block font-sora text-sm font-bold text-purple-600">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-md border border-purple-200/60 px-4 py-2.5 font-inter text-sm 
                     text-purple-600 focus:border-purple-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex shrink-0 items-center gap-1 rounded-md bg-purple-50 px-4 py-2.5 
                     font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-100 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sora text-xs font-semibold ${tagStyles}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="rounded-full p-0.5 hover:bg-black/10 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Helper Component for Availability Timetable ---
function SchedulePicker({ availability, onChange }) {
  const toggleDay = (day) => {
    const updated = { ...availability };
    if (updated[day]?.active) {
      updated[day] = { ...updated[day], active: false };
    } else {
      updated[day] = {
        active: true,
        start: updated[day]?.start || "09:00",
        end: updated[day]?.end || "17:00",
      };
    }
    onChange(updated);
  };

  const updateTime = (day, field, value) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const removeSlot = (day) => {
    const updated = { ...availability };
    delete updated[day];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {DAYS_OF_WEEK.map((day) => {
        const slot = availability[day] || { active: false, start: "09:00", end: "17:00" };
        const isActive = slot.active;

        return (
          <div
            key={day}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
              isActive
                ? "border-teal-200 bg-teal-50/30"
                : "border-purple-200/40 bg-purple-50/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`day-${day}`}
                checked={isActive}
                onChange={() => toggleDay(day)}
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label
                htmlFor={`day-${day}`}
                className="font-sora text-sm font-bold text-purple-600 cursor-pointer select-none"
              >
                {day}
              </label>
            </div>

            {isActive ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => updateTime(day, "start", e.target.value)}
                  className="rounded-md border border-purple-200/60 bg-white px-2.5 py-1.5 font-inter text-xs text-purple-600 focus:outline-none"
                />
                <span className="font-inter text-xs text-purple-600/60">to</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => updateTime(day, "end", e.target.value)}
                  className="rounded-md border border-purple-200/60 bg-white px-2.5 py-1.5 font-inter text-xs text-purple-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSlot(day)}
                  title="Remove slot"
                  className="ml-2 rounded-md p-1.5 text-coral-600 hover:bg-coral-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span className="font-inter text-xs text-purple-600/40 italic">
                Not available
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Main Edit Component ---
export default function VolunteerProfileEdit() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const { volunteerProfile, loadingProfile, refetchProfile } = useOutletContext();

  // Sync volunteer profile data into form state when ready
  useEffect(() => {
    if (volunteerProfile) {
      setForm({
        avatar: undefined,
        existingAvatarUrl: volunteerProfile.avatar_url ?? null,
        firstName: volunteerProfile.first_name ?? "",
        lastName: volunteerProfile.last_name ?? "",
        email: volunteerProfile.email ?? "",
        bio: volunteerProfile.bio ?? "",
        contactNumber: volunteerProfile.contact_number ?? "",
        location: volunteerProfile.location ?? "",
        skills: Array.isArray(volunteerProfile.skills) ? volunteerProfile.skills : [],
        interests: Array.isArray(volunteerProfile.interests) ? volunteerProfile.interests : [],
        availability: volunteerProfile.availability && typeof volunteerProfile.availability === "object"
          ? volunteerProfile.availability
          : {},
      });
    }
  }, [volunteerProfile]);

  if (loadingProfile) {
    return (
      <p className="font-inter text-sm text-purple-600/60">
        Loading profile...
      </p>
    );
  }

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Handlers for Skills
  const handleAddSkill = (skill) => {
    if (!form.skills.includes(skill)) {
      updateField("skills", [...form.skills, skill]);
    }
  };
  const handleRemoveSkill = (index) => {
    updateField("skills", form.skills.filter((_, i) => i !== index));
  };

  // Handlers for Interests
  const handleAddInterest = (interest) => {
    if (!form.interests.includes(interest)) {
      updateField("interests", [...form.interests, interest]);
    }
  };
  const handleRemoveInterest = (index) => {
    updateField("interests", form.interests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    const { error: submitError } = await updateVolunteerProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      contactNumber: form.contactNumber,
      location: form.location,
      skills: form.skills,
      interests: form.interests,
      availability: form.availability,
      avatar: form.avatar,
      existingAvatarUrl: form.existingAvatarUrl,
    });

    setIsSaving(false);

    if (submitError) {
      setError(submitError.message || "Something went wrong.");
      return;
    }

    await refetchProfile();
    showToast({ type: "success", message: "Profile updated." });
    navigate("/volunteer/profile");
  };

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "Volunteer";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Edit Profile
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-5 py-2.5 font-sora text-sm font-bold text-purple-600
                       transition-colors hover:bg-purple-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-purple-600 px-6 py-2.5 font-sora text-sm font-bold text-purple-50
                       transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-6 flex justify-center">
          <AvatarUploadField
            initialImageUrl={form.existingAvatarUrl}
            name={fullName}
            onChange={(file) => updateField("avatar", file)}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              id="firstName"
              label="First name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
            <FormField
              id="lastName"
              label="Last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
          </div>

          <div>
            <FormField
              id="email"
              label="Email address"
              value={form.email}
              disabled
            />
            <p className="mt-1 font-inter text-xs text-purple-600/50">
              Email address cannot be changed directly.
            </p>
          </div>

          <TextAreaField
            id="bio"
            label="Bio"
            placeholder="Tell organizers and fellow volunteers about yourself..."
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={4}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              id="contactNumber"
              label="Contact number"
              type="tel"
              placeholder="e.g. +60 12-345 6789"
              value={form.contactNumber}
              onChange={(e) => updateField("contactNumber", e.target.value)}
            />
            <FormField
              id="location"
              label="Location / City"
              placeholder="e.g. Kuala Lumpur, MY"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Skills
          </h2>
        </div>
        <TagInput
          label="Add your skills"
          tags={form.skills}
          onAddTag={handleAddSkill}
          onRemoveTag={handleRemoveSkill}
          placeholder="e.g. First Aid, Event Logistics, Teaching..."
          colorTheme="purple"
        />
      </section>

      {/* Interests */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Interests & Causes
          </h2>
        </div>
        <TagInput
          label="Add causes you care about"
          tags={form.interests}
          onAddTag={handleAddInterest}
          onRemoveTag={handleRemoveInterest}
          placeholder="e.g. Animal Welfare, Environment, Youth..."
          colorTheme="coral"
        />
      </section>

      {/* Availability */}
      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h2 className="font-sora text-lg font-extrabold text-purple-600">
            Weekly Availability
          </h2>
        </div>
        <p className="mb-4 font-inter text-xs text-purple-600/70">
          Check the days you are available and specify your preferred time slots.
        </p>
        <SchedulePicker
          availability={form.availability}
          onChange={(newAvailability) => updateField("availability", newAvailability)}
        />
      </section>
    </form>
  );
}