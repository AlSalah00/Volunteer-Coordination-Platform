import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ActivityCard from "../../components/activities/ActivityCard";
import FilterModal from "../../components/common/FilterModal";
import { mapActivityToCard } from "../../utils/activities";
import { getBookmarkedActivities, toggleBookmark } from "../../services/bookmarks";
import { useToast } from "../../contexts/ToastContext";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBookmarks() {
      setLoading(true);
      const { data, error: fetchError } = await getBookmarkedActivities();
      if (!isMounted) return;

      if (fetchError) {
        setError("Failed to load bookmarks.");
      } else {
        setActivities((data || []).map(mapActivityToCard));
      }
      setLoading(false);
    }

    loadBookmarks();
    return () => { isMounted = false; };
  }, []);

  const handleCardClick = (id) => {
    navigate(`/volunteer/explore/${id}`);
  };

  const handleRemoveBookmark = async (activityId, e) => {
    e.stopPropagation();

    setActivities((prev) => prev.filter((a) => a.id !== activityId));

    const { error: toggleErr } = await toggleBookmark(activityId, true);
    if (toggleErr) {
      showToast({ type: "error", message: "Couldn't remove bookmark." });
      const { data } = await getBookmarkedActivities();
      setActivities((data || []).map(mapActivityToCard));
    } else {
      showToast({ type: "success", message: "Removed from bookmarks." });
    }
  };

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 font-sora text-3xl font-extrabold text-purple-600">
          Bookmarks
        </h1>
        <p className="mb-8 font-inter text-sm text-purple-600/60">
          Activities you bookmarked appear here.
        </p>

        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-md border border-purple-600/20 bg-white py-2.5 pl-11 pr-4 font-inter text-sm text-purple-800 placeholder:text-purple-600/40 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-md border-2 border-purple-600/20 bg-white px-5 py-2.5 font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer"
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
            You have not bookmarked any activities.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              variant="volunteer"
              isBookmarked={true}
              onBookmarkClick={(e) => handleRemoveBookmark(activity.id, e)}
              onClick={() => handleCardClick(activity.id)}
            />
          ))}
        </div>
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}