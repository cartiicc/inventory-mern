import { forwardRef } from 'react';

/**
 * Reusable input with label + error message, designed for react-hook-form's register().
 */
const Input = forwardRef(({ label, error, type = 'text', icon: Icon, className, ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input ref={ref} type={type} className={`input ${Icon ? 'pl-10' : ''}`} {...props} />
      </div>
      {error && <p className="text-danger-600 text-xs mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
