import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, MapPin, Globe, ClipboardList } from "lucide-react";
import StatusBadge from "../../components/activities/StatusBadge";
import TaskPreviewCard from "../../components/activities/TaskPreviewCard";
import LocationMapPreview from "../../components/activities/LocationMapPreview";
import Avatar from "../../components/common/Avatar";
import { getPublicActivityById } from "../../services/activities";
import { formatDateRange } from "../../utils/activities";
import { useAuth } from "../../contexts/AuthContext";
import defaultActivityImage from "../../assets/defaultActivityImage.svg";

export default function ExploreActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getPublicActivityById(id).then(({ data, error: fetchError }) => {
      if (!isMounted) return;
      if (fetchError || !data) {
        setError("Couldn't load this activity.");
      } else {
        setActivity(data);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // TODO: real apply flow (task slot selection) comes later
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-purple-50">
        <p className="p-10 font-inter text-sm text-purple-600/60">Loading...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen w-full bg-purple-50">
        <div className="mx-auto max-w-3xl p-10">
          <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error || "Activity not found."}
          </div>
        </div>
      </div>
    );
  }

  const totalCapacity = (activity.activity_tasks ?? []).reduce(
    (sum, t) => sum + (t.capacity ?? 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-purple-50">

      <div className="mx-auto max-w-3xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 font-sora text-sm font-bold text-purple-600 hover:underline cursor-pointer"
        >
          ← Back
        </button>

        {/* Details */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-purple-200/60 bg-white">
          <img
            src={activity.image_url || defaultActivityImage}
            alt=""
            className="h-56 w-full object-cover"
          />

          <div className="p-6 sm:p-8">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h1 className="font-sora text-2xl font-extrabold text-purple-600">{activity.name}</h1>
              <StatusBadge status={activity.status} />
            </div>

            <Link
              to={`/organizers/${activity.organizer_id}`}
              className="mb-5 flex w-fit items-center gap-2.5 rounded-full py-1 pr-3 transition-colors hover:bg-purple-50"
            >
              <Avatar src={activity.organizer_avatar_url} name={activity.organizer_name} size={32} />
              <span className="font-inter text-sm font-medium text-purple-600">
                {activity.organizer_name}
              </span>
            </Link>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold text-purple-600">
                {activity.category}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 font-sora text-xs font-bold text-purple-600">
                {activity.activity_type === "online" ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Online
                  </>
                ) : (
                  "In-person"
                )}
              </span>
            </div>

            <div className="mb-5 flex items-center gap-2 font-inter text-sm text-purple-600/70">
              <Calendar className="h-4 w-4" />
              {formatDateRange(activity.starts_at, activity.ends_at)}
            </div>

            {activity.requirements && (
              <div className="mb-6">
                <h3 className="mb-1.5 font-sora text-sm font-bold text-purple-600">
                  General requirements
                </h3>
                <p className="font-inter text-sm text-purple-600/70 leading-relaxed">
                  {activity.requirements}
                </p>
              </div>
            )}

            {activity.activity_type === "online" ? (
              <div>
                <h3 className="mb-1.5 flex items-center gap-1.5 font-sora text-sm font-bold text-purple-600">
                  <Globe className="h-4 w-4" />
                  Platform
                </h3>
                <p className="font-inter text-sm text-purple-600/70">
                  {activity.online_platform || "Not specified"}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="mb-1.5 flex items-center gap-1.5 font-sora text-sm font-bold text-purple-600">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="mb-3 font-inter text-sm text-purple-600/70">{activity.location_name}</p>
                <LocationMapPreview
                  lat={activity.latitude}
                  lng={activity.longitude}
                  address={activity.location_name}
                />
              </div>
            )}
          </div>
        </section>

        {/* Tasks */}
        <section className="mb-8 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-sora text-lg font-extrabold text-purple-600">
              <ClipboardList className="h-5 w-5" />
              Tasks
            </h2>
            <span className="font-inter text-sm text-purple-600/60">
              {totalCapacity} volunteer spot{totalCapacity === 1 ? "" : "s"} total
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {(activity.activity_tasks ?? []).map((task, index) => (
              <TaskPreviewCard key={task.id} index={index} task={task} />
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={handleApply}
          className="w-full rounded-md bg-purple-600 py-3.5 font-sora text-base font-bold text-purple-50
                     transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer"
        >
          Count Me In
        </button>
      </div>
    </div>
  );
}
