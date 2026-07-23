import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import ImageUploadField from "../../components/activities/ImageUploadField";
import LocationPicker from "../../components/activities/LocationPicker";
import TaskCard from "../../components/activities/TaskCard";
import StatusBadge from "../../components/activities/StatusBadge";

export default function ActivityForm() {
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    image: null,
    name: "",
    startsAt: "",
    endsAt: "",
    category: "",
    location: "",
    requirements: "",
  });

  const [tasks, setTasks] = useState([]);

  const updateDetail = (field, value) => setDetails((prev) => ({ ...prev, [field]: value }));

  const addTask = () =>
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", description: "", capacity: "", level: "any" },
    ]);

  const updateTask = (id, nextTask) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? nextTask : t)));

  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const totalCapacity = tasks.reduce((sum, t) => sum + (Number(t.capacity) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to Supabase — create the activity row, then the task rows
    console.log({ details, tasks });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-sora text-3xl font-extrabold text-purple-600">New Activity</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-5 py-2.5 font-sora text-sm font-bold text-purple-600
                       transition-colors hover:bg-purple-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-600 px-6 py-2.5 font-sora text-sm font-bold text-purple-50
                       transition-all duration-200 hover:bg-purple-800 active:scale-95 cursor-pointer"
          >
            Publish Activity
          </button>
        </div>
      </div>

      {/* Details */}
      <section className="mb-8 rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <h2 className="mb-6 font-sora text-lg font-extrabold text-purple-600">Details</h2>

        <div className="flex flex-col gap-6">
          <ImageUploadField value={details.image} onChange={(file) => updateDetail("image", file)} />

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
                <StatusBadge status="upcoming" />
              </div>
              <p className="font-inter text-xs text-purple-600/50">
                New activities always start as upcoming.
              </p>
            </div>
          </div>

          <LocationPicker value={details.location} onChange={(val) => updateDetail("location", val)} />

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
