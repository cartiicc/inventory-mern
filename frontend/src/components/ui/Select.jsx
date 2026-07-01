import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], placeholder, className, ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <select ref={ref} className="input" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger-600 text-xs mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
