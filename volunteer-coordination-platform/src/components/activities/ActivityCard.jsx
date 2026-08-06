import {
  Calendar,
  MapPin,
  Globe,
  Users,
  Pencil,
  ClipboardCheck,
  UserCheck,
  Bookmark,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import Button from "../common/Button";
import { formatDateTime } from "../../utils/activities";
import defaultActivityImage from "../../assets/defaultActivityImage.svg";

function ActionIcon({ icon: Icon, label, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button
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
  status,
  category,
  type,
  shortLocation,
  volunteersFilled,
  volunteersCapacity,
  variant = "organizer", // "organizer" | "volunteer" | "volunteer-applications"
  isBookmarked = false,
  onBookmark,
  onClick,
  onEdit,
  onTrack,
  onViewApplicants,
  onReadAIFeedback,
}) {
  const hasFilledCount = volunteersFilled != null;
  const fillPercent =
    hasFilledCount && volunteersCapacity
      ? Math.min(100, Math.round((volunteersFilled / volunteersCapacity) * 100))
      : 0;

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
      className="group/card flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {/* Image Thumbnail */}
      <div className="relative w-36 shrink-0 sm:w-44">
        <img
          src={image || defaultActivityImage}
          alt=""
          className="h-full w-full object-cover"
        />

        {/* Bookmark Button (Volunteer Browsing Variant Only) */}
        {variant === "volunteer" && (
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark activity"}
            className="absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-purple-600 shadow-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Bookmark
              className={`h-4 w-4 transition-colors ${
                isBookmarked
                  ? "fill-purple-600 text-purple-600"
                  : "text-purple-600"
              }`}
            />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-sora text-base font-bold text-purple-600 transition-colors">
              {title}
            </h3>
          </div>

          {/* Category & Type Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold text-purple-600">
              {category}
            </span>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold capitalize text-purple-600">
              {type}
            </span>
          </div>

          {/* Date & Activity Status */}
          <div className="flex flex-wrap items-center gap-2 font-inter text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-inter text-xs text-purple-600/60">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDateTime(date)}</span>
            </div>
            {status && (
              <>
                <span className="text-purple-600/60">•</span>
                <span className="font-inter text-xs text-purple-600/60">
                  {status}
                </span>
              </>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 font-inter text-xs text-purple-600/60">
            {type === "online" ? (
              <>
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>Online</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{shortLocation}</span>
              </>
            )}
          </div>

          {/* Volunteer Spots & Progress Bar */}
          <div>
            <div className="mb-1 flex items-center gap-1.5 font-inter text-xs text-purple-600/70">
              <Users className="h-3.5 w-3.5" />
              <span>
                {hasFilledCount
                  ? `${volunteersFilled}/${volunteersCapacity} joined`
                  : `${volunteersCapacity} spot${volunteersCapacity === 1 ? "" : "s"} available`}
              </span>
            </div>
            {hasFilledCount && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-purple-50">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Separator + Actions */}
        {variant === "volunteer-applications" && (
          <>
            <div className="my-4 border-t border-purple-100" />

            <div className="mt-auto pt-1">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrack?.(e);
                }}
                className="w-full"
              >
                Where Things Stand
              </Button>
            </div>
          </>
        )}

        {variant === "organizer" && (
          <>
            <div className="my-4 border-t border-purple-100" />

            <div className="mt-auto flex items-center gap-2 pt-1">
              <ActionIcon icon={Pencil} label="Edit" onClick={onEdit} />
              <ActionIcon
                icon={ClipboardCheck}
                label="Track"
                onClick={onTrack}
              />
              <ActionIcon
                icon={UserCheck}
                label="Applicants"
                onClick={onViewApplicants}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
