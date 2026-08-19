import React, { useEffect } from 'react';
import { X, ShieldCheck, Mail } from 'lucide-react';
import { Button } from './Button';

export const GrievanceOfficerModal = ({ isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Grievance Officer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4 text-center">
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-300">
              For any grievances, inquiries, or support regarding Contata Hackathon 2026, please write to us at:
            </p>
            <div className="pt-2">
              <a
                href="mailto:hackathongrievance@contata.com"
                className="inline-block text-sm sm:text-base font-mono font-bold text-orange-400 hover:text-orange-300 underline transition-colors"
              >
                hackathongrievance@contata.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 shrink-0 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
