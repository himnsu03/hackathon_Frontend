import React from 'react';

export const TextArea = React.forwardRef(({
  label,
  error,
  helperText,
  rows = 5,
  placeholder,
  required = false,
  charCount,
  minChars,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
        )}
        {typeof charCount === 'number' && (
          <span className={`text-xs font-mono ${minChars && charCount < minChars ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
            {charCount} {minChars ? `/ ${minChars} min characters` : 'characters'}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        placeholder={placeholder}
        className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3.5 transition-all duration-200 focus:outline-none focus:ring-2 resize-y ${
          error
            ? 'border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500'
            : 'border-slate-700/80 focus:ring-orange-500/30 focus:border-orange-500 hover:border-slate-600'
        } ${className}`}
        {...props}
      />

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

TextArea.displayName = 'TextArea';
