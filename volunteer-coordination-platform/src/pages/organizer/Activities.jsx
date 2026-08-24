import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../../components/activities/ActivityCard";
import { getOrganizerActivities } from "../../services/activities";
import { mapActivityToCard } from "../../utils/activities";
import Button from "../../components/common/Button";

export default function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isVerified, loadingProfile } = useOutletContext();

  const canCreateActivity = !loadingProfile && isVerified;

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
        {canCreateActivity ? (
          <Link to="new">
            <Button variant="primary">+ Create Activity</Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            disabled={true}
            title={
              loadingProfile
                ? "Loading profile..."
                : "Activity Creation Locked"
            }
          >
            + Create Activity
          </Button>
        )}
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
            onTrack={() =>
              navigate(`/organizer/activities/${activity.id}/track`)
            }
            onViewApplicants={() =>
              navigate(`/organizer/activities/${activity.id}/applicants`, {
                state: { activityName: activity.title },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
