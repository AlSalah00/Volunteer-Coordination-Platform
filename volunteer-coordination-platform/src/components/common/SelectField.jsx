import CustomSelect from "./CustomSelect";

export default function SelectField({
  label,
  id,
  options,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-inter text-sm font-medium text-purple-600/80">
          {label}
        </label>
      )}
      <CustomSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
      />
    </div>
  );
}