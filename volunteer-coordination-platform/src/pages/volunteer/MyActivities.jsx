import { useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState(""); // not wired up yet
  const [showFilters, setShowFilters] = useState(false);
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

  return (
    <div className="min-h-screen w-full bg-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 font-sora text-3xl font-extrabold text-purple-600">
          My Activities
        </h1>
        <p className="mb-8 font-inter text-sm text-purple-600/60">
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
            className="flex items-center gap-2 rounded-md border-2 border-purple-600/20 bg-white px-5 py-2.5
                       font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
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

        {!loading && !error && applications.length === 0 && (
          <p className="font-inter text-sm text-purple-600/60">
            You haven't applied to anything yet — head to Explore to find
            something.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {applications.map((application) => (
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

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <ApplicationTrackingDrawer
        applicationId={trackingApplicationId}
        isOpen={trackingApplicationId !== null}
        onClose={() => setTrackingApplicationId(null)}
        onWithdrawn={handleWithdrawn}
      />
    </div>
  );
}
