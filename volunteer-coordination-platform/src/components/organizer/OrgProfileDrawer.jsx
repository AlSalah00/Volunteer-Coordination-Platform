import { Star, ShieldCheck, Mail, Phone, MapPin, Hash } from "lucide-react";
import Drawer from "../common/Drawer";
import Avatar from "../common/Avatar";

function InfoRow({ icon: Icon, label }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-inter text-sm text-purple-600/80">{label}</span>
    </div>
  );
}

export default function OrgProfileDrawer({ isOpen, onClose, organizer }) {
  if (!organizer) return null;

  const name = organizer.organizer_name || "Organizer";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Organization Profile"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Banner Header */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-purple-600 p-6 text-center">
          <Avatar
            src={organizer.organizer_avatar_url}
            name={name}
            size={80}
            className="border-4 border-white/20 shadow-md"
          />
          <h2 className="mt-3 font-sora text-xl font-extrabold text-white">
            {name}
          </h2>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="font-sora text-xs font-bold text-white">
                {organizer.rating
                  ? `${Number(organizer.rating).toFixed(1)} Rating`
                  : "New Host"}
              </span>
            </div>

            {/* Verification Badge */}
            {organizer.verification === "verified" && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                <span className="font-sora text-xs font-bold text-emerald-200">
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio / About */}
        {organizer.bio && (
          <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
            <h3 className="mb-2 font-sora text-sm font-extrabold text-purple-600">
              About Organization
            </h3>
            <p className="font-inter text-xs leading-relaxed text-purple-600/70">
              {organizer.bio}
            </p>
          </section>
        )}

        {/* Organization Info & Contact */}
        <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
          <h3 className="mb-3 font-sora text-sm font-extrabold text-purple-600">
            Contact & Info
          </h3>
          <div className="flex flex-col gap-3">
            <InfoRow icon={Mail} label={organizer.email} />
            <InfoRow icon={Phone} label={organizer.contact_number} />
            <InfoRow icon={MapPin} label={organizer.address} />
            <InfoRow
              icon={Hash}
              label={
                organizer.registration_no
                  ? `Reg No: ${organizer.registration_no}`
                  : null
              }
            />
          </div>
        </section>
      </div>
    </Drawer>
  );
}
