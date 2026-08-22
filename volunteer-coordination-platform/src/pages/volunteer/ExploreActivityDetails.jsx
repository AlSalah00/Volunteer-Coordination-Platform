import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { Calendar, MapPin, Globe, ClipboardList } from "lucide-react";
import StatusBadge from "../../components/activities/StatusBadge";
import TaskPreviewCard from "../../components/activities/TaskPreviewCard";
import LocationMapPreview from "../../components/activities/LocationMapPreview";
import Avatar from "../../components/common/Avatar";
import { getPublicActivityById } from "../../services/activities";
import { formatDateRange } from "../../utils/activities";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import defaultActivityImage from "../../assets/defaultActivityImage.svg";
import ConfirmModal from "../../components/common/ConfirmModal";
import TaskSelectionModal from "../../components/activities/TaskSelectionModal";
import { isVolunteerProfileComplete } from "../../services/profile";
import { submitApplication } from "../../services/applications";
import { checkUserApplicationStatus } from "../../services/activities";
import Button from "../../components/common/Button";
import OrgProfileDrawer from "../../components/organizer/OrgProfileDrawer";

export default function ExploreActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const outletContext = useOutletContext();
  const volunteerProfile = outletContext?.volunteerProfile ?? null;

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const [showOrgDrawer, setShowOrgDrawer] = useState(false);

  const [showIncompleteProfileModal, setShowIncompleteProfileModal] =
    useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPage() {
      setLoading(true);

      const [{ data, error }, { data: hasApplied }] = await Promise.all([
        getPublicActivityById(id),
        volunteerProfile
          ? checkUserApplicationStatus(id)
          : Promise.resolve({ data: false, error: null }),
      ]);

      if (!isMounted) return;

      if (error || !data) {
        setError("Couldn't load this activity.");
      } else {
        setActivity(data);
        setHasApplied(hasApplied);
      }

      setLoading(false);
    }

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [id, volunteerProfile]);

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isVolunteerProfileComplete(volunteerProfile)) {
      setShowIncompleteProfileModal(true);
      return;
    }

    setShowTaskModal(true);
  };

  const handleConfirmApplication = async (taskId) => {
    if (!activity?.id) return;

    setIsSubmittingApplication(true);
    const { error: submitError } = await submitApplication({
      activityId: activity.id,
      taskId,
    });
    setIsSubmittingApplication(false);

    if (submitError) {
      showToast({
        type: "error",
        message: "Oh no! We couldn't send your request. Please try again.",
      });
      return;
    }

    setShowTaskModal(false);
    setHasApplied(true);
    showToast({
      type: "success",
      message:
        "Thanks for raising your hand! Your request to volunteer has been sent to the host.",
    });
    navigate("/volunteer/my-activities");
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
    0,
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
              <h1 className="font-sora text-2xl font-extrabold text-purple-600">
                {activity.name}
              </h1>
              <StatusBadge status={activity.status} />
            </div>

            <button
              type="button"
              onClick={() => setShowOrgDrawer(true)}
              className="mb-5 flex w-fit items-center gap-2.5 rounded-full py-1 pr-3 transition-colors hover:bg-purple-50 cursor-pointer"
            >
              <Avatar
                src={activity.organizer_avatar_url}
                name={activity.organizer_name}
                size={32}
              />
              <span className="font-inter text-sm font-medium text-purple-600">
                {activity.organizer_name}
              </span>
            </button>

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
                <p className="mb-3 font-inter text-sm text-purple-600/70">
                  {activity.location_name}
                </p>
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
              {totalCapacity} volunteer spot{totalCapacity === 1 ? "" : "s"}{" "}
              total
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {(activity.activity_tasks ?? []).map((task, index) => (
              <TaskPreviewCard key={task.id} index={index} task={task} />
            ))}
          </div>
        </section>

        <Button
          onClick={handleApplyClick}
          disabled={hasApplied}
          className="w-full"
        >
          {hasApplied ? "Application Submitted" : "Count Me In"}
        </Button>
      </div>

      <ConfirmModal
        isOpen={showIncompleteProfileModal}
        title="Let's finish your profile first"
        description="To get matched with the right activities, we just need a bit more info about you — a few skills, interests, your availability, and your location."
        confirmLabel="Complete Profile"
        cancelLabel="Maybe Later"
        onConfirm={() => navigate("/volunteer/profile/edit")}
        onCancel={() => setShowIncompleteProfileModal(false)}
      />

      <TaskSelectionModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        tasks={activity.activity_tasks ?? []}
        isSubmitting={isSubmittingApplication}
        onConfirm={handleConfirmApplication}
      />

      <OrgProfileDrawer
        isOpen={showOrgDrawer}
        onClose={() => setShowOrgDrawer(false)}
        organizer={activity}
      />
    </div>
  );
}
