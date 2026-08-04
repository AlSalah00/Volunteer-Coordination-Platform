import { Calendar, MapPin, Globe, Users, Pencil, ClipboardCheck, UserCheck, Bookmark } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../../utils/activities";
import defaultActivityImage from "../../assets/defaultActivityImage.svg";

function ActionIcon({ icon: Icon, label, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600
                 transition-colors hover:bg-purple-600 hover:text-purple-50 cursor-pointer"
    >
      <Icon className="h-4 w-4" />
      <span
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md
                   bg-purple-800 px-2.5 py-1 font-inter text-[11px] text-purple-50 opacity-0
                   transition-opacity group-hover:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}

export default function ActivityCard({
  title,
  image,
  date,
  status, // Activity status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  applicationStatus, // Volunteer status: 'submitted' | 'approved' | 'rejected' | null
  category,
  type,
  shortLocation,
  volunteersFilled,
  volunteersCapacity,
  variant = "organizer",
  isBookmarked = false,
  onBookmark,
  onClick,
  onEdit,
  onTrack,
  onViewApplicants,
}) {
  const hasFilledCount = volunteersFilled != null;
  const fillPercent =
    hasFilledCount && volunteersCapacity
      ? Math.min(100, Math.round((volunteersFilled / volunteersCapacity) * 100))
      : 0;

  // Contextual status badge logic
  const displayStatus =
    variant === "volunteer" && applicationStatus && applicationStatus !== "approved"
      ? applicationStatus
      : status;

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmark?.(e);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      className="group/card flex overflow-hidden rounded-2xl border border-purple-200/60 bg-white shadow-sm
                 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative w-36 shrink-0 sm:w-44">
        <img src={image || defaultActivityImage} alt="" className="h-full w-full object-cover" />

        {/* Bookmark Icon Button (Volunteer Variant Only) */}
        {variant === "volunteer" && (
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark activity"}
            className="absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-full
                       bg-white/80 text-purple-600 shadow-sm transition-all
                       hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Bookmark
              className={`h-4 w-4 transition-colors ${
                isBookmarked ? "fill-purple-600 text-purple-600" : "text-purple-600"
              }`}
            />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
        <div className="space-y-3">
          {/* Header & Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-sora text-base font-bold text-purple-600 group-hover/card:text-purple-600 transition-colors">
                {title}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 font-inter text-xs text-purple-600/60">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {formatDateTime(date)}
              </div>
            </div>
            <StatusBadge status={displayStatus} />
          </div>

          {/* Category & Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold text-purple-600">
              {category}
            </span>
            {type === "online" ? (
              <span className="flex items-center gap-1 font-inter text-xs text-purple-600/60">
                <Globe className="h-3.5 w-3.5" />
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1 font-inter text-xs text-purple-600/60">
                <MapPin className="h-3.5 w-3.5" />
                {shortLocation}
              </span>
            )}
          </div>

          {/* Volunteer Spots / Progress */}
          <div>
            <div className="mb-1 flex items-center gap-1 font-inter text-xs text-purple-600/70">
              <Users className="h-3.5 w-3.5" />
              {hasFilledCount
                ? `${volunteersFilled}/${volunteersCapacity} joined`
                : `${volunteersCapacity} spot${volunteersCapacity === 1 ? "" : "s"} available`}
            </div>
            {hasFilledCount && (
              <div className="h-1.5 overflow-hidden rounded-full bg-purple-50">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Organizer Actions (Only visible for organizer variant) */}
        {variant === "organizer" && (
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-purple-100/50">
            <ActionIcon icon={Pencil} label="Edit" onClick={onEdit} />
            <ActionIcon icon={ClipboardCheck} label="Track" onClick={onTrack} />
            <ActionIcon icon={UserCheck} label="Applicants" onClick={onViewApplicants} />
          </div>
        )}
      </div>
    </div>
  );
}