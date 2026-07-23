import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActivityCard from "../../components/activities/ActivityCard";
import { getOrganizerActivities } from "../../services/activities";
import { mapActivityToCard } from "../../utils/activities";

export default function Activities() {
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
          className="rounded-lg bg-purple-600 px-4 py-2 font-inter text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
            onEdit={() => console.log("edit", activity.id)}
            onTrack={() => console.log("track", activity.id)}
            onViewApplicants={() => console.log("applicants", activity.id)}
          />
        ))}
      </div>
    </div>
  );
}