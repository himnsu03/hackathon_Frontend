import React, { useEffect } from 'react';
import { X, FileText, CheckCircle2, Award, ShieldAlert, Code2, Users, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export const TermsModal = ({ isOpen, onClose }) => {
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

      <div className="relative w-full max-w-4xl max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Contata Hackathon 2026 — Terms & Conditions
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Rules of Participation, Intellectual Property, and Code of Conduct
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 flex-1 min-h-0 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Eligibility */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 1. Eligibility & Registration
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-1">
              <li>Participation is open to enrolled college students and recent graduates aged 18 years or older at the time of registration.</li>
              <li>Each participant must register with accurate, verifiable details (full name, valid college email/mobile number).</li>
              <li>Only one registration per individual is permitted. Duplicate accounts will lead to disqualification.</li>
            </ul>
          </section>

          {/* Originality & Academic Integrity */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> 2. Originality & Academic Integrity
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-1">
              <li>All project implementations, synopsis proposals, and source code must be created by the participant during the designated sprint period.</li>
              <li>Use of open-source libraries, frameworks, and third-party APIs is allowed provided they are properly cited. Submitting pre-existing proprietary codebases or third-party turn-key solutions is strictly prohibited.</li>
              <li>Submissions are subject to automated code similarity, AI-assisted originality checks, and manual evaluator audits. Plagiarized submissions will be disqualified immediately.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 3. Intellectual Property Rights
            </h4>
            <p className="text-xs text-slate-300">
              Participants retain copyright and ownership of the original code and architecture created by them during the Hackathon. By submitting, participants grant Contata Solutions a non-exclusive, worldwide, royalty-free license to review, evaluate, test, and demonstrate the submission for hackathon administration, awards, and recruitment purposes.
            </p>
          </section>

          {/* Evaluation & Awards */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> 4. Evaluation, Scoring & Awards
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-1">
              <li>Submissions are evaluated against published technical criteria (architecture, problem-solving, UI/UX, code quality, and live deployment).</li>
              <li>Decisions made by the panel of judges and evaluators are final and binding.</li>
              <li>Prizes, cash awards, and interview opportunities are non-transferable and subject to tax deductions where mandated by applicable Indian law.</li>
            </ul>
          </section>

          {/* Code of Conduct */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 5. Code of Conduct
            </h4>
            <p className="text-xs text-slate-300">
              Contata Solutions is committed to providing a safe, inclusive, and harassment-free event environment for everyone. Unsportsmanlike conduct, hacking/tampering with competition infrastructure, or abusive behavior will result in immediate disqualification and account termination.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 shrink-0 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            I Understand & Agree
          </Button>
        </div>
      </div>
    </div>
  );
};
