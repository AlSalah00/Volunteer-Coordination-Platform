import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import AvatarUploadField from "../../components/common/AvatarUploadField";
import { useToast } from "../../contexts/ToastContext";
import { updateOrganizerProfile } from "../../services/profile";
import Button from "../../components/common/Button";

const emptyForm = {
  avatar: undefined, // undefined = unchanged, File = new upload, null = removed
  existingAvatarUrl: null,
  orgName: "",
  bio: "",
  address: "",
  contactNumber: "",
};

export default function OrgProfileEdit() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const { organizerProfile, isVerified, loadingProfile, refetchProfile } =
    useOutletContext();

  // Sync profile data into form state when organizerProfile is ready
  useEffect(() => {
    if (organizerProfile) {
      setForm({
        avatar: undefined,
        existingAvatarUrl: organizerProfile.avatar_url ?? null,
        orgName: organizerProfile.org_name ?? "",
        bio: organizerProfile.bio ?? "",
        address: organizerProfile.address ?? "",
        contactNumber: organizerProfile.contact_number ?? "",
      });
    }
  }, [organizerProfile]);

  if (loadingProfile) {
    return (
      <p className="font-inter text-sm text-purple-600/60">
        Loading profile...
      </p>
    );
  }

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    const { error: submitError } = await updateOrganizerProfile({
      orgName: form.orgName,
      bio: form.bio,
      address: form.address,
      contactNumber: form.contactNumber,
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
    navigate("/organizer/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Edit Profile
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-6 flex justify-center">
          <AvatarUploadField
            initialImageUrl={form.existingAvatarUrl}
            name={form.orgName}
            onChange={(file) => updateField("avatar", file)}
          />
        </div>

        <div className="flex flex-col gap-6">
          <FormField
            id="orgName"
            label="Organization name"
            value={form.orgName}
            onChange={(e) => updateField("orgName", e.target.value)}
            required
          />

          <TextAreaField
            id="bio"
            label="Bio"
            placeholder="Tell volunteers a bit about your organization..."
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={4}
          />

          <FormField
            id="address"
            label="Address"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />

          <FormField
            id="contactNumber"
            label="Contact number"
            type="tel"
            placeholder="e.g. +60 12-345 6789"
            value={form.contactNumber}
            onChange={(e) => updateField("contactNumber", e.target.value)}
          />
        </div>
      </section>
    </form>
  );
}
