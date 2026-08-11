import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  id,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={`w-full bg-slate-900/80 border text-slate-100 text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
          error
            ? 'border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500'
            : 'border-slate-700/80 focus:ring-orange-500/30 focus:border-orange-500 hover:border-slate-600'
        } ${className}`}
        {...props}
      >
        <option value="" disabled className="bg-slate-900 text-slate-500">
          {placeholder}
        </option>
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={value} value={value} className="bg-slate-900 text-slate-100">
              {labelText}
            </option>
          );
        })}
      </select>

      {error ? (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-0.5">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
