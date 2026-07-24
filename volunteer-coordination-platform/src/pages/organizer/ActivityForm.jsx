import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import ImageUploadField from "../../components/activities/ImageUploadField";
import LocationPicker from "../../components/activities/LocationPicker";
import ActivityTypeToggle from "../../components/activities/ActivityTypeToggle";
import TaskCard from "../../components/activities/TaskCard";
import StatusBadge from "../../components/activities/StatusBadge";
import { createActivity, updateActivity, deleteActivity, getActivityById } from "../../services/activities";
import { toDatetimeLocal } from "../../utils/activities";

const emptyDetails = {
  image: undefined, // undefined = unchanged, File = new upload, null = removed
  existingImageUrl: null,
  name: "",
  startsAt: "",
  endsAt: "",
  category: "",
  status: "upcoming",
  activityType: "in_person",
  location: "",
  onlinePlatform: "",
  requirements: "",
};

export default function ActivityForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [details, setDetails] = useState(emptyDetails);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;

    getActivityById(id).then(({ data, error: fetchError }) => {
      if (!isMounted) return;

      if (fetchError || !data) {
        setError("Couldn't load this activity.");
        setIsLoading(false);
        return;
      }

      setDetails({
        image: undefined,
        existingImageUrl: data.image_url,
        name: data.name,
        startsAt: toDatetimeLocal(data.starts_at),
        endsAt: toDatetimeLocal(data.ends_at),
        category: data.category,
        status: data.status,
        activityType: data.activity_type,
        location: data.location_name
          ? { address: data.location_name, lat: data.latitude, lng: data.longitude }
          : "",
        onlinePlatform: data.online_platform || "",
        requirements: data.requirements || "",
      });

      setTasks(
        (data.activity_tasks ?? []).map((task) => ({
          id: task.id,
          name: task.name,
          description: task.description || "",
          capacity: String(task.capacity),
          level: task.level,
        }))
      );

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  const updateDetail = (field, value) => setDetails((prev) => ({ ...prev, [field]: value }));

  const addTask = () =>
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", description: "", capacity: "", level: "any" },
    ]);

  const updateTask = (taskId, nextTask) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? nextTask : t)));

  const removeTask = (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const totalCapacity = tasks.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tasks.length === 0) {
      setError("Add at least one task before publishing.");
      return;
    }

    setIsSubmitting(true);
    const { error: submitError } = isEditMode
      ? await updateActivity(id, { details, tasks })
      : await createActivity({ details, tasks });
    setIsSubmitting(false);

    if (submitError) {
      setError(submitError.message || "Something went wrong.");
      return;
    }

    navigate(isEditMode ? `/organizer/activities/${id}` : "/organizer/activities");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this activity? This can't be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    const { error: deleteError } = await deleteActivity(id);
    setIsDeleting(false);

    if (deleteError) {
      setError(deleteError.message || "Couldn't delete this activity.");
      return;
    }

    navigate("/organizer/activities");
  };

  if (isLoading) {
    return <p className="font-inter text-sm text-purple-600/60">Loading activity...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">
          {isEditMode ? "Edit Activity" : "New Activity"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-5 py-2.5 font-sora text-sm font-bold text-purple-600
                       transition-colors hover:bg-purple-50 cursor-pointer"
          >
            Cancel
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-md px-5 py-2.5 font-sora text-sm font-bold text-coral-600
                         transition-colors hover:bg-coral-50 cursor-pointer
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Activity"}
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-purple-600 px-6 py-2.5 font-sora text-sm font-bold text-purple-50
                       transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Publishing..."
              : isEditMode
                ? "Update Activity"
                : "Publish Activity"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      {/* Details */}
      <section className="mb-8 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-6 font-sora text-lg font-extrabold text-purple-600">Details</h2>

        <div className="flex flex-col gap-6">
          <ImageUploadField
            initialImageUrl={details.existingImageUrl}
            onChange={(file) => updateDetail("image", file)}
          />

          <FormField
            id="activityName"
            label="Activity name"
            placeholder="e.g. Beach Cleanup at Pantai Bagan"
            value={details.name}
            onChange={(e) => updateDetail("name", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="startsAt"
              label="Starts"
              type="datetime-local"
              value={details.startsAt}
              onChange={(e) => updateDetail("startsAt", e.target.value)}
              required
            />
            <FormField
              id="endsAt"
              label="Ends"
              type="datetime-local"
              value={details.endsAt}
              onChange={(e) => updateDetail("endsAt", e.target.value)}
              min={details.startsAt || undefined}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="category"
              label="Category"
              placeholder="e.g. Environment, Elderly Care"
              value={details.category}
              onChange={(e) => updateDetail("category", e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <span className="font-inter text-sm font-medium text-purple-600/80">Status</span>
              <div className="flex h-10.5 items-center">
                <StatusBadge status={details.status} />
              </div>
              <p className="font-inter text-xs text-purple-600/50">
                {isEditMode
                  ? "Status updates automatically as your activity progresses."
                  : "New activities always start as upcoming."}
              </p>
            </div>
          </div>

          <ActivityTypeToggle
            value={details.activityType}
            onChange={(value) => updateDetail("activityType", value)}
          />

          {details.activityType === "online" ? (
            <FormField
              id="onlinePlatform"
              label="Where's it happening online?"
              placeholder="e.g. Zoom, Google Meet, MS Teams"
              value={details.onlinePlatform}
              onChange={(e) => updateDetail("onlinePlatform", e.target.value)}
              required
            />
          ) : (
            <LocationPicker
              value={details.location}
              onChange={(val) => updateDetail("location", val)}
            />
          )}

          <TextAreaField
            id="requirements"
            label="General requirements"
            placeholder="Anything volunteers should know or bring before joining? (e.g. comfortable shoes, own transport)"
            value={details.requirements}
            onChange={(e) => updateDetail("requirements", e.target.value)}
            rows={3}
          />
        </div>
      </section>

      {/* Tasks */}
      <section className="mb-8 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-sora text-lg font-extrabold text-purple-600">Tasks</h2>
          <span className="font-inter text-sm text-purple-600/60">
            {totalCapacity} volunteer spot{totalCapacity === 1 ? "" : "s"} total
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              index={index}
              task={task}
              onChange={(next) => updateTask(task.id, next)}
              onRemove={() => removeTask(task.id)}
            />
          ))}

          {tasks.length === 0 && (
            <p className="font-inter text-sm text-purple-600/50">
              No tasks yet — add at least one so volunteers know what they'll be doing.
            </p>
          )}

          <button
            type="button"
            onClick={addTask}
            className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-purple-600/25 py-3
                       font-sora text-sm font-bold text-purple-600 transition-colors hover:bg-purple-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </section>
    </form>
  );
}