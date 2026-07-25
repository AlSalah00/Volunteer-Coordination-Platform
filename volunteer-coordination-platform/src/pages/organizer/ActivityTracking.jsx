import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import StatusDropdown from "../../components/activities/StatusDropdown";
import TaskChecklistItem from "../../components/activities/TaskChecklistItem";
import { getActivityById } from "../../services/activities";

const SAMPLE_ASSIGNEES = ["Aisyah Rahman", "Wei Jian Tan", "Priya Kumar", null];

export default function ActivityTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getActivityById(id).then(({ data, error: fetchError }) => {
      if (!isMounted) return;

      if (fetchError || !data) {
        setError("Couldn't load this activity.");
        setLoading(false);
        return;
      }

      setActivity(data);
      setStatus(data.status);
      setTasks(
        (data.activity_tasks ?? []).map((task, index) => ({
          ...task,
          completed: false,
          assignee: SAMPLE_ASSIGNEES[index % SAMPLE_ASSIGNEES.length],
        }))
      );
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);
    // TODO: persist to Supabase once this page is wired up
    // supabase.from("activities").update({ status: nextStatus }).eq("id", id)
  };

  if (loading) {
    return <p className="font-inter text-sm text-purple-600/60">Loading...</p>;
  }

  if (error || !activity) {
    return (
      <div className="rounded-md border border-coral-600/20 bg-coral-50 px-4 py-3 text-sm text-coral-600">
        {error || "Activity not found."}
      </div>
    );
  }

  const checkedIn = 5;
  const totalRegistered = 10;
  const attendancePercent = totalRegistered
    ? Math.round((checkedIn / totalRegistered) * 100)
    : 0;

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-2 font-sora text-sm font-bold text-purple-600 hover:underline cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="font-sora text-3xl font-extrabold text-purple-600">{activity.name}</h1>
        </div>

        <StatusDropdown status={status} onChange={handleStatusChange} />
      </div>

      {/* Attendance */}
      <div className="mb-6 flex items-center gap-6 rounded-2xl border border-purple-200/60 bg-white p-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-50">
          <span className="font-sora text-xl font-extrabold text-purple-600">
            {attendancePercent}%
          </span>
        </div>
        <div>
          <p className="flex items-center gap-1.5 font-sora text-xs font-bold uppercase tracking-wide text-purple-600/60">
            <Users className="h-3.5 w-3.5" />
            Attendance
          </p>
          <p className="font-sora text-2xl font-extrabold text-purple-600">
            {checkedIn}/{totalRegistered}
          </p>
          <p className="font-inter text-xs text-purple-600/50">volunteers checked in</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-2xl border border-purple-200/60 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-sora text-lg font-extrabold text-purple-600">Tasks</h2>
          <span className="font-inter text-sm text-purple-600/60">
            {tasks.filter((t) => t.completed).length}/{tasks.length} done
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskChecklistItem
              key={task.id}
              task={task}
              onToggleComplete={() => toggleTaskComplete(task.id)}
            />
          ))}

          {tasks.length === 0 && (
            <p className="font-inter text-sm text-purple-600/50">No tasks on this activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
