import { useEffect, useState } from "react";
import { Sparkles, Wrench, Heart, Calendar, Mail, Phone, MapPin } from "lucide-react";
import Drawer from "../common/Drawer";
import Avatar from "../common/Avatar";
import { getVolunteerProfileById } from "../../services/profile";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

function PillTag({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-purple-200/60 bg-purple-50 px-3 py-1 font-sora text-xs font-semibold text-purple-600">
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

export default function VolProfileDrawer({ isOpen, onClose, applicant, volunteerId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeVolunteerId = applicant?.volunteerId;

  useEffect(() => {
    if (!isOpen || !activeVolunteerId) {
      setProfile(null);
      return;
    }

    setLoading(true);
    getVolunteerProfileById(activeVolunteerId).then(({ data }) => {
      setProfile(data);
      setLoading(false);
    });
  }, [isOpen, activeVolunteerId]);

  const renderAvailability = () => {
    const avail = profile?.availability;
    
    if (!avail || (typeof avail === "object" && Object.keys(avail).length === 0)) {
      return (
        <p className="font-inter text-xs text-purple-600/50">
          No availability details set.
        </p>
      );
    }

    if (typeof avail === "object" && !Array.isArray(avail)) {
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
          <div className="grid grid-cols-1 gap-2">
            {activeSlots.map(({ day, start, end }, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-purple-200/60 bg-white px-3.5 py-2.5"
              >
                <span className="font-sora text-xs font-bold text-purple-600">
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
      <p className="font-inter text-xs text-purple-600/50">
        No availability details set.
      </p>
    );
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Volunteer Profile" maxWidth="max-w-lg">
      {loading || !profile ? (
        <div className="p-8 text-center font-inter text-sm text-purple-600/60">
          Loading profile details...
        </div>
      ) : (
        <div className="space-y-5">
          {/* Banner Header */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-purple-600 p-6 text-center">
            <Avatar
              src={profile.volunteerAvatarUrl}
              name={profile.fullName}
              size={80}
              className="border-4 border-white/20 shadow-md"
            />
            <h2 className="mt-3 font-sora text-xl font-extrabold text-white">
              {profile.fullName}
            </h2>

            {(profile.level || profile.title) && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span className="font-sora text-xs font-bold text-white">
                  Level {profile.level ?? 1} – {profile.title ?? "Volunteer"}
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
              <h3 className="mb-2 font-sora text-sm font-extrabold text-purple-600">
                About
              </h3>
              <p className="font-inter text-xs leading-relaxed text-purple-600/70">
                {profile.bio}
              </p>
            </section>
          )}

          {/* Skills */}
          <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-600" />
              <h3 className="font-sora text-sm font-extrabold text-purple-600">
                Skills
              </h3>
            </div>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <PillTag key={idx} label={skill} />
                ))}
              </div>
            ) : (
              <p className="font-inter text-xs text-purple-600/50">
                No skills listed.
              </p>
            )}
          </section>

          {/* Interests */}
          <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-600" />
              <h3 className="font-sora text-sm font-extrabold text-purple-600">
                Interests & Causes
              </h3>
            </div>
            {profile.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <PillTag key={idx} label={interest} />
                ))}
              </div>
            ) : (
              <p className="font-inter text-xs text-purple-600/50">
                No interests listed.
              </p>
            )}
          </section>

          {/* Availability */}
          <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <h3 className="font-sora text-sm font-extrabold text-purple-600">
                Availability
              </h3>
            </div>
            {renderAvailability()}
          </section>

          {/* Contact Info */}
          <section className="rounded-2xl border border-purple-200/60 bg-white p-5">
            <h3 className="mb-3 font-sora text-sm font-extrabold text-purple-600">
              Contact Info
            </h3>
            <div className="flex flex-col gap-3">
              <InfoRow icon={Mail} label={profile.email} />
              <InfoRow icon={Phone} label={profile.contact_number} />
              <InfoRow icon={MapPin} label={profile.location} />
            </div>
          </section>
        </div>
      )}
    </Drawer>
  );
}