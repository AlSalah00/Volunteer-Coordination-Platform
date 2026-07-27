import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import AvatarUploadField from "../../components/common/AvatarUploadField";
import { getOrganizerProfile, updateOrganizerProfile } from "../../services/profile";
import { useToast } from "../../contexts/ToastContext";

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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrganizerProfile().then(({ data, error: fetchError }) => {
      if (!isMounted) return;

      if (fetchError || !data) {
        setError("Couldn't load your profile.");
        setLoading(false);
        return;
      }

      setForm({
        avatar: undefined,
        existingAvatarUrl: data.avatar_url,
        orgName: data.org_name,
        bio: data.bio || "",
        address: data.address || "",
        contactNumber: data.contact_number || "",
      });
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

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

    showToast({ type: "success", message: "Profile updated." });
    navigate("/organizer/profile");
  };

  if (loading) {
    return <p className="font-inter text-sm text-purple-600/60">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">Edit Profile</h1>
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
