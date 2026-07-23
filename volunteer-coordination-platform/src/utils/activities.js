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
    status: activity.status,
    category: activity.category,
    type: activity.activity_type === "online" ? "online" : "in-person",
    shortLocation: shortenLocation(activity.location_name),
    volunteersCapacity,
  };
}