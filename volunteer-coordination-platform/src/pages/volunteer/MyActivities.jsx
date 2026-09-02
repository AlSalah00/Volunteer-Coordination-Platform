import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ActivityCard from "../../components/activities/ActivityCard";
import FilterModal from "../../components/common/FilterModal";
import { getMyApplications } from "../../services/applications";
import { mapActivityToCard } from "../../utils/activities";
import ApplicationTrackingDrawer from "../../components/applications/ApplicationTrackingDrawer";

export default function MyActivities() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    selectedCategories: [],
    activityType: "any",
  });
  const [trackingApplicationId, setTrackingApplicationId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMyApplications().then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError) {
        setError("Couldn't load your activities. Try refreshing.");
      } else {
        setApplications(data);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTrack = (application) => setTrackingApplicationId(application.id);

  const handleWithdrawn = (applicationId) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  // Filter applications in real-time based on search and selected filters
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const cardProps = mapActivityToCard(application.activities);

      // 1. Search Query Match (Title, Category, or Location)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        cardProps.title?.toLowerCase().includes(query) ||
        cardProps.category?.toLowerCase().includes(query) ||
        cardProps.shortLocation?.toLowerCase().includes(query);

      // 2. Category Match
      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(cardProps.category);

      // 3. Activity Type Match
      const normalizedType = cardProps.type?.toLowerCase().replace("-", "_");
      const matchesType =
        filters.activityType === "any" ||
        normalizedType === filters.activityType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [applications, searchQuery, filters]);

  const hasActiveFilters =
    filters.selectedCategories.length > 0 || filters.activityType !== "any";

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="mb-2 font-sora text-2xl sm:text-3xl font-extrabold text-purple-600">
          My Activities
        </h1>
        <p className="mb-8 font-inter text-xs sm:text-sm text-purple-600/60">
          Everything you've applied to, in one place.
        </p>

        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your activities..."
              className="w-full rounded-md border border-purple-600/20 bg-white py-2.5 pl-11 pr-4
                         font-inter text-sm text-purple-800 placeholder:text-purple-600/40
                         transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className={`relative flex items-center gap-2 rounded-md border-2 bg-white px-5 py-2.5
                       font-sora text-sm font-bold transition-colors cursor-pointer ${
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
            Loading your activities...
          </p>
        )}

        {error && (
          <div className="mb-6 rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredApplications.length === 0 && (
          <p className="font-inter text-sm text-purple-600/60">
            {applications.length === 0
              ? "You haven't requested to volunteer for anything yet. Head to Explore to find something."
              : "No activities match your search or filter criteria."}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredApplications.map((application) => (
            <ActivityCard
              key={application.id}
              {...mapActivityToCard(application.activities)}
              variant="volunteer-applications"
              onClick={() =>
                navigate(`/volunteer/explore/${application.activities.id}`)
              }
              onTrack={() => handleTrack(application)}
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

      <ApplicationTrackingDrawer
        applicationId={trackingApplicationId}
        isOpen={trackingApplicationId !== null}
        onClose={() => setTrackingApplicationId(null)}
        onWithdrawn={handleWithdrawn}
      />
    </div>
  );
}