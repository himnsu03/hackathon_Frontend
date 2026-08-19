import React, { useEffect } from 'react';
import { X, Cookie, CheckCircle2 } from 'lucide-react';

export const CookieSettingsModal = ({ isOpen, onClose, onSave }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGotIt = () => {
    const payload = { essential: true, functional: true, analytics: true, timestamp: new Date().toISOString() };
    localStorage.setItem('contata_cookie_preferences', JSON.stringify(payload));
    if (onSave) onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Why We Use Cookies
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Information about cookies and storage on Contata Hackathon 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 flex-1 min-h-0 overflow-y-auto space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p className="text-xs text-slate-300 leading-relaxed">
            We use cookies and browser storage solely to provide a seamless, reliable experience during the hackathon:
          </p>

          <ul className="space-y-3 text-xs text-slate-300 pl-1">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-slate-100 font-semibold">Stay signed in:</strong> Keeps your account active so you can navigate across problem tracks, the dashboard, and submission pages without having to sign in repeatedly.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-slate-100 font-semibold">Save your progress:</strong> Automatically preserves your ongoing entries and drafts so your work isn't lost if you refresh or switch tabs.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-slate-100 font-semibold">Remember your preferences:</strong> Retains your interface settings and countdown view options for a comfortable experience.
              </span>
            </li>
          </ul>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>We do not use advertising cookies, and your data is never sold to third parties.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={handleGotIt}
            className="px-6 py-2 bg-[#4dd0e1] hover:bg-[#26c6da] active:bg-[#00acc1] text-slate-950 font-bold text-xs rounded-xl transition-colors shadow cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
