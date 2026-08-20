import { STATUS_META } from "../components/activities/StatusBadge";

// Helper to safely parse strings across all browsers (including Safari)
function parseDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const normalized = typeof input === "string" ? input.replace(" ", "T") : input;
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
}

export function toDatetimeLocal(isoString) {
  const date = parseDate(isoString);
  if (!date) return "";
  
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function deriveStatusFromDates(startsAt, endsAt) {
  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);
 
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

export function formatDateTime(dateInput) {
  const date = parseDate(dateInput);
  if (!date) return "";

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateLabel} · ${timeLabel}`;
}

export function formatDateRange(startInput, endInput) {
  const start = parseDate(startInput);
  const end = parseDate(endInput);
  if (!start) return "";

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const startDateLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (!end) {
    return `${startDateLabel} · ${startTime}`;
  }

  const endTime = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (start.toDateString() === end.toDateString()) {
    return `${startDateLabel} · ${startTime} – ${endTime}`;
  }

  const endDateLabel = end.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${startDateLabel}, ${startTime} – ${endDateLabel}, ${endTime}`;
}

/**
 * Truncates a full address down to something card-sized. Tries to break
 * at a comma so it doesn't cut mid-word.
 */

export function shortenLocation(address, maxLength = 30) {
  if (!address) return "";
  if (address.length <= maxLength) return address;

  const truncated = address.slice(0, maxLength);
  const lastComma = truncated.lastIndexOf(",");
  const cutPoint = lastComma > maxLength * 0.4 ? lastComma : maxLength;

  return `${address.slice(0, cutPoint).trim()}...`;
}

/**
 * Maps a raw Supabase activity row into the
 * shape ActivityCard expects.
 */
export function mapActivityToCard(activity) {
  const volunteersCapacity = (activity.activity_tasks ?? []).reduce(
    (sum, task) => sum + (task.capacity ?? 0),
    0
  );
 
  return {
    id: activity.id,
    title: activity.name,
    image: activity.image_url,
    date: activity.starts_at,
    status: STATUS_META[activity.status]?.label ?? activity.status,
    category: activity.category,
    type: activity.activity_type === "online" ? "online" : "in-person",
    shortLocation: shortenLocation(activity.location_name),
    volunteersCapacity,
  };
}
