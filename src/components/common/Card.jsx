import React from 'react';

export const Card = ({ children, className = '', title, subtitle, headerAction, footer }) => {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl transition-all duration-300 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="mt-6 pt-4 border-t border-slate-800/80">{footer}</div>}
    </div>
  );
};
