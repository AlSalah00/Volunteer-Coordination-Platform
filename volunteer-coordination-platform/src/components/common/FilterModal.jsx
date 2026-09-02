import { useEffect, useState } from "react";
import Modal from "./Modal";

// Static placeholder list
const CATEGORY_OPTIONS = [
  "Environment",
  "Education",
  "Elderly Care",
  "Animal Welfare",
  "Community",
  "Health",
];

const TYPE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "in_person", label: "In-Person" },
  { value: "online", label: "Online" },
];

export default function FilterModal({ isOpen, onClose, initialFilters, onApply }) {
  const [selectedCategories, setSelectedCategories] = useState(
    initialFilters?.selectedCategories || []
  );
  const [activityType, setActivityType] = useState(
    initialFilters?.activityType || "any"
  );

  // Sync internal state with props whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(initialFilters?.selectedCategories || []);
      setActivityType(initialFilters?.activityType || "any");
    }
  }, [isOpen, initialFilters]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setActivityType("any");
  };

  const handleApply = () => {
    onApply({
      selectedCategories,
      activityType,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <h2 className="mb-5 font-sora text-lg font-extrabold text-purple-600">Filter Activities</h2>

      <div className="mb-6">
        <h3 className="mb-3 font-inter text-sm font-medium text-purple-600/80">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 font-sora text-xs font-bold transition-colors ${
                  isSelected
                    ? "border-purple-600 bg-purple-600 text-purple-50"
                    : "border-purple-600/20 text-purple-600 hover:bg-purple-50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 font-inter text-sm font-medium text-purple-600/80">Activity Type</h3>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActivityType(option.value)}
              className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 font-sora text-xs font-bold transition-colors ${
                activityType === option.value
                  ? "border-purple-600 bg-purple-600 text-purple-50"
                  : "border-purple-600/20 text-purple-600 hover:bg-purple-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer font-sora text-sm font-bold text-purple-600/60 hover:text-purple-600"
        >
          Clear all
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-4 py-2.5 font-sora text-sm font-bold text-purple-600 hover:bg-purple-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="cursor-pointer rounded-md bg-purple-600 px-5 py-2.5 font-sora text-sm font-bold text-purple-50
                       transition-all duration-200 hover:bg-purple-800 active:scale-95"
          >
            Show Results
          </button>
        </div>
      </div>
    </Modal>
  );
}