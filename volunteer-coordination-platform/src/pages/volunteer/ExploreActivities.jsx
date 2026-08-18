import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ActivityCard from "../../components/activities/ActivityCard";
import FilterModal from "../../components/common/FilterModal";
import { getPublicActivities } from "../../services/activities";
import { getUserBookmarkIds, toggleBookmark } from "../../services/bookmarks";
import { mapActivityToCard } from "../../utils/activities";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function ExploreActivities() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // not wired up yet
  const [showFilters, setShowFilters] = useState(false);

  const isVolunteerRoute = location.pathname.startsWith("/volunteer");
  const basePath = isVolunteerRoute ? "/volunteer/explore" : "/explore";

  useEffect(() => {
    let isMounted = true;

    getPublicActivities().then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError) {
        setError("Couldn't load activities. Try refreshing.");
      } else {
        setActivities(data.map(mapActivityToCard));
      }
      setLoading(false);
    });

    if (isVolunteerRoute) {
      getUserBookmarkIds().then(({ data }) => {
        if (!isMounted) return;
        setBookmarkedIds(new Set(data || []));
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isVolunteerRoute]);

  const handleCardClick = (id) => {
    navigate(`${basePath}/${id}`);
  };

  const handleToggleBookmark = async (activityId, e) => {
    e.stopPropagation();
    const isCurrentlyBookmarked = bookmarkedIds.has(activityId);

    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyBookmarked) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
    const { error: toggleErr } = await toggleBookmark(
      activityId,
      isCurrentlyBookmarked,
    );

    if (toggleErr) {
      showToast({ type: "error", message: "Failed to update bookmark." });
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyBookmarked) {
          next.add(activityId);
        } else {
          next.delete(activityId);
        }
        return next;
      });
    } else {
      showToast({
        type: "success",
        message: isCurrentlyBookmarked
          ? "Removed from bookmarks."
          : "Activity bookmarked!",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 font-sora text-3xl font-extrabold text-purple-600">
          Explore Activities
        </h1>
        <p className="mb-8 font-inter text-sm text-purple-600/60">
          Find something worth showing up for.
        </p>

        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-md border border-purple-600/20 bg-white py-2.5 pl-11 pr-4
                         font-inter text-sm text-purple-800 placeholder:text-purple-600/40
                         transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-md border-2 border-purple-600/20 bg-white px-5 py-2.5
                       font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {loading && (
          <p className="font-inter text-sm text-purple-600/60">
            Loading activities...
          </p>
        )}

        {error && (
          <div className="mb-6 rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error}
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <p className="font-inter text-sm text-purple-600/60">
            No activities open right now. Check back soon.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              variant={isVolunteerRoute ? "volunteer" : "public"}
              isBookmarked={bookmarkedIds.has(activity.id)}
              onBookmark={(e) => handleToggleBookmark(activity.id, e)}
              onClick={() => handleCardClick(activity.id)}
            />
          ))}
        </div>
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}
