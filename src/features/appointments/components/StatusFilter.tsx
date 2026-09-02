interface StatusFilterProps<TValue extends string> {
  label?: string;
  options: TValue[];
  value: TValue;
  onChange: (value: TValue) => void;
}

function StatusFilter<TValue extends string>({
  label = 'Status',
  options,
  value,
  onChange,
}: StatusFilterProps<TValue>) {
  return (
    <label className="grid gap-1 text-sm font-medium text-[#5b3e45]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="rounded-lg border border-pink-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#df7f98]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default StatusFilter;
