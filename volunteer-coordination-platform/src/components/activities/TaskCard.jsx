import { Trash2 } from "lucide-react";
import FormField from "../common/FormField";
import TextAreaField from "../common/TextAreaField";
import SelectField from "../common/SelectField";

// Provisional — swap once the real leveling system is defined.
const LEVEL_OPTIONS = [
  { value: "any", label: "Any level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function TaskCard({ index, task, onChange, onRemove }) {
  const update = (field, val) => onChange({ ...task, [field]: val });

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-purple-200/60 bg-purple-50/40 p-5">
      <div className="flex items-center justify-between">
        <span className="font-sora text-sm font-bold text-purple-600">Task {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove task"
          className="flex h-8 w-8 items-center justify-center rounded-full text-purple-600/50
                     transition-colors hover:bg-coral-50 hover:text-coral-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <FormField
        id={`task-name-${task.id}`}
        label="Task name"
        placeholder="e.g. Registration desk"
        value={task.name}
        onChange={(e) => update("name", e.target.value)}
        required
      />

      <TextAreaField
        id={`task-description-${task.id}`}
        label="Description"
        placeholder="What will volunteers actually be doing?"
        value={task.description}
        onChange={(e) => update("description", e.target.value)}
        rows={3}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id={`task-capacity-${task.id}`}
          label="Volunteer capacity"
          type="number"
          min="1"
          placeholder="e.g. 5"
          value={task.capacity}
          onChange={(e) => update("capacity", e.target.value)}
          required
        />
        <SelectField
          id={`task-level-${task.id}`}
          label="Level required"
          value={task.level}
          onChange={(e) => update("level", e.target.value)}
          options={LEVEL_OPTIONS}
        />
      </div>
    </div>
  );
}
