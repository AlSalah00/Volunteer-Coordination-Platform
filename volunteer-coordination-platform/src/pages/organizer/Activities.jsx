import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../../components/activities/ActivityCard";
import { getOrganizerActivities } from "../../services/activities";
import { mapActivityToCard } from "../../utils/activities";

export default function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrganizerActivities().then(({ data, error: fetchError }) => {
      if (!isMounted) return;

      if (fetchError) {
        setError("Couldn't load your activities. Try refreshing.");
      } else {
        setActivities(data.map(mapActivityToCard));
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          Activities
        </h1>
        <Link
          to="new"
          className="flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-sora text-sm font-bold text-purple-50
                     transition-all duration-200 hover:bg-purple-800 active:scale-95"
        >
          + Create Activity
        </Link>
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

      {!loading && !error && activities.length === 0 && (
        <p className="font-inter text-sm text-purple-600/60">
          No activities yet. Create your first one to get started.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            {...activity}
            onClick={() => navigate(`/organizer/activities/${activity.id}`)}
            onEdit={() => navigate(`/organizer/activities/${activity.id}/edit`)}
            onTrack={() => console.log("track", activity.id)}
            onViewApplicants={() => console.log("applicants", activity.id)}
          />
        ))}
      </div>
    </div>
  );
}