import CustomSelect from "../common/CustomSelect";
import { STATUS_META } from "./StatusBadge";

const UPDATABLE_STATUSES = ["active", "completed", "cancelled"];

export default function StatusDropdown({ status, onChange }) {
  const current = STATUS_META[status] ?? STATUS_META.upcoming;

  const options = UPDATABLE_STATUSES.map((val) => ({
    value: val,
    ...STATUS_META[val],
  }));

  return (
    <CustomSelect
      value={status}
      onChange={onChange}
      options={options}
      selectedOption={{ value: status, ...current }}
      align="right"
      className="w-fit"
      triggerClassName={`flex items-center gap-2 rounded-full px-4 py-2 font-sora text-sm font-bold transition-colors cursor-pointer ${current.bg} ${current.text}`}
      menuClassName="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-purple-200/60 bg-white p-1 shadow-lg"
      renderOption={(option) => (
        <span className="flex items-center gap-2.5 font-inter text-sm text-purple-600/80">
          <span className={`h-2 w-2 rounded-full ${option.dot}`} />
          {option.label}
        </span>
      )}
    />
  );
}