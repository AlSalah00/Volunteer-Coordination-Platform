import { useEffect, useState, useMemo } from "react";
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
  const [filters, setFilters] = useState({
    selectedCategories: [],
    activityType: "any",
  });

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

  // Filter bookmarked activities in real-time based on search and selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // 1. Search Query Match (Title, Category, or Location)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        activity.title?.toLowerCase().includes(query) ||
        activity.category?.toLowerCase().includes(query) ||
        activity.shortLocation?.toLowerCase().includes(query);

      // 2. Category Match
      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(activity.category);

      // 3. Activity Type Match
      const normalizedType = activity.type?.toLowerCase().replace("-", "_");
      const matchesType =
        filters.activityType === "any" ||
        normalizedType === filters.activityType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [activities, searchQuery, filters]);

  const hasActiveFilters =
    filters.selectedCategories.length > 0 || filters.activityType !== "any";

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="mb-2 font-sora text-2xl sm:text-3xl font-extrabold text-purple-600">
          Bookmarks
        </h1>
        <p className="mb-8 font-inter text-xs sm:text-sm text-purple-600/60">
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
            className={`relative flex items-center gap-2 rounded-md border-2 bg-white px-5 py-2.5 font-sora text-sm font-bold transition-colors cursor-pointer ${
              hasActiveFilters
                ? "border-purple-600 text-purple-600 bg-purple-50/50"
                : "border-purple-600/20 text-purple-600 hover:bg-purple-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-purple-600" />
            )}
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

        {!loading && !error && filteredActivities.length === 0 && (
          <p className="font-inter text-sm text-purple-600/60">
            {activities.length === 0
              ? "You have not bookmarked any activities."
              : "No bookmarked activities match your search or filter criteria."}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              variant="volunteer"
              isBookmarked={true}
              onBookmark={(e) => handleRemoveBookmark(activity.id, e)}
              onClick={() => handleCardClick(activity.id)}
            />
          ))}
        </div>
      </div>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
}