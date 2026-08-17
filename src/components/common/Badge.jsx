import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const Badge = ({ status = 'NOT_SUBMITTED', className = '' }) => {
  const normalized = status.toUpperCase();

  const configs = {
    ACTIVE: {
      label: 'Active',
      styles: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      styles: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    SUBMITTED: {
      label: 'Submitted',
      styles: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      icon: CheckCircle2,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      styles: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    LOCKED: {
      label: 'Submitted',
      styles: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      icon: CheckCircle2,
    },
    PENDING: {
      label: 'Pending Review',
      styles: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    PENDING_REVIEW: {
      label: 'Pending Review',
      styles: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    REJECTED: {
      label: 'Rejected',
      styles: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
    NOT_SUBMITTED: {
      label: 'Not Submitted',
      styles: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      icon: AlertCircle,
    },
    INTERVIEW_COMPLETED: {
      label: 'Interview Completed',
      styles: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    INTERVIEWED: {
      label: 'Interview Completed',
      styles: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    INTERVIEW_PENDING: {
      label: 'Interview Pending',
      styles: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
  };

  const config = configs[normalized] || configs.NOT_SUBMITTED;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${config.styles} ${className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
};
