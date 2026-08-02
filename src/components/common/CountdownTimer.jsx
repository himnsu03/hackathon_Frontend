import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export const CountdownTimer = ({
  targetDate, // ISO string or timestamp
  secondsLeft: initialSeconds, // directly supplied seconds
  onExpire,
  size = 'md', // sm | md | lg
  urgentThresholdHours = 24,
}) => {
  const [seconds, setSeconds] = useState(() => {
    if (typeof initialSeconds === 'number') return initialSeconds;
    if (targetDate) {
      const diff = Math.floor((new Date(targetDate).getTime() - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof initialSeconds === 'number') {
      setSeconds(initialSeconds);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onExpire]);

  const formatTime = (totalSec) => {
    if (totalSec <= 0) return { days: 0, hours: 0, minutes: 0, secs: 0 };
    const days = Math.floor(totalSec / (3600 * 24));
    const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = formatTime(seconds);
  const isUrgent = seconds > 0 && seconds <= urgentThresholdHours * 3600;
  const isExpired = seconds <= 0;

  const pad = (num) => String(num).padStart(2, '0');

  if (size === 'lg') {
    return (
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md transition-all ${
        isExpired
          ? 'bg-rose-950/60 border-rose-600/50 text-rose-300'
          : isUrgent
          ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 animate-pulse'
          : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
      }`}>
        <Timer className={`w-6 h-6 ${isUrgent ? 'text-amber-400' : 'text-indigo-400'}`} />
        <div className="flex items-baseline gap-2 font-mono font-bold tracking-widest text-2xl">
          {days > 0 && (
            <span>
              <span className="text-3xl">{days}</span>d{' '}
            </span>
          )}
          <span>{pad(hours)}</span>:
          <span>{pad(minutes)}</span>:
          <span className="text-indigo-400">{pad(secs)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium ${
      isExpired
        ? 'bg-rose-950/40 border-rose-500/30 text-rose-400'
        : isUrgent
        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        : 'bg-slate-900/80 border-slate-700 text-slate-300'
    }`}>
      <Timer className="w-3.5 h-3.5" />
      <span>
        {isExpired ? 'LOCKED' : `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(secs)}`}
      </span>
    </div>
  );
};
