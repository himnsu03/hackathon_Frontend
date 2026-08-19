import React, { useEffect } from 'react';
import { X, Shield, Lock, Eye, FileText, CheckCircle2, UserCheck, AlertCircle, Building, HelpCircle } from 'lucide-react';
import { Button } from './Button';

export const PrivacyNoticeModal = ({ isOpen, onClose }) => {
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
              <Shield className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                Contata Hackathon 2026 — Privacy Notice
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Effective Date: 19 August 2026 | Last Updated: 19 August 2026
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
          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-xl text-slate-300">
            <p>
              <strong>Contata Solutions</strong> respects your privacy and is committed to protecting your personal data. This Privacy Notice explains how we collect, use, store, protect and process personal data when you register for or participate in <strong>Contata Hackathon 2026</strong>.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              By registering for the Hackathon, you acknowledge that you have read this Privacy Notice and understand how your personal data will be processed.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              1. What Personal Data We Collect
            </h4>
            <p className="text-xs text-slate-300">
              Depending on your participation in the Hackathon, we may collect the following categories of personal data:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Full name
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Email address & contact details
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Mobile / phone number
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> College or institute name
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Graduation year
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Date of Birth (for age & eligibility verification)
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Tech stack tags & Resume / CV document
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Submissions, project repositories & live demos
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              2. Why We Collect and Use Your Personal Data
            </h4>
            <p className="text-xs text-slate-300">
              We process your data strictly for legitimate operational purposes:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>To register you for the Hackathon and manage your participant profile.</li>
              <li>To verify eligibility and participant requirements (minimum age 18, graduating batches).</li>
              <li>To communicate registration confirmations, event updates, schedules, guidelines, and results.</li>
              <li>To manage submissions, synopsis proposals, source code repositories, and evaluations.</li>
              <li>To evaluate hackathon submissions via expert evaluators and automated AI analysis.</li>
              <li>To issue certificates, prizes, cash awards, and employment fast-track interview opportunities.</li>
              <li>To maintain event compliance, business audit, and technical operational records.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              3. How We Store and Protect Your Personal Data
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your participant details, account credentials, and submissions are stored in our secure database with industry-standard password hashing and strict role-based access controls. Uploaded documents (such as resumes) are saved on our dedicated application server with unique identifiers. Access to participant information is strictly restricted to authorized hackathon organizers and assigned evaluators.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              4. Who We May Share Your Personal Data With
            </h4>
            <p className="text-xs text-slate-300">
              We share data only where strictly necessary:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>Authorized members of the Contata Hackathon organizing and recruitment teams.</li>
              <li>Assigned judges, mentors, and evaluators reviewing your project submissions.</li>
              <li>Authorized infrastructure and communication service providers (e.g. hosting, email delivery).</li>
              <li>Regulatory or law-enforcement authorities where mandated by applicable law.</li>
            </ul>
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-semibold">
              ✓ We do NOT sell your personal data. We do NOT share your data with third parties for independent marketing.
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              5. Data Retention Schedule
            </h4>
            <p className="text-xs text-slate-300">
              Personal data and submission records are retained for <strong>12 months</strong> following the conclusion of the Hackathon to facilitate certificate verification, prize distribution, hiring pipeline evaluation, and legal audit compliance. Following this period, records are securely deleted or anonymized.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              6. Your Privacy Rights
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have the right to access, update, or request the deletion of your personal data at any time. To request a copy of your stored records, correct any details, or withdraw your participation, please contact our Grievance Officer directly at{' '}
              <a href="mailto:hackathongrievance@contata.com" className="text-orange-400 font-semibold underline">
                hackathongrievance@contata.com
              </a>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              7. Grievance Officer / Privacy Contact
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              For any privacy inquiries, grievance redressal, or data-related questions, please write to our designated Data Protection & Grievance Officer at{' '}
              <a href="mailto:hackathongrievance@contata.com" className="text-orange-400 font-semibold underline">
                hackathongrievance@contata.com
              </a>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
              8. Updates to this Privacy Notice
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We may update this Privacy Notice periodically to reflect operational, legal, or regulatory changes. Any modifications will be posted on this page with an updated revision date.
            </p>
          </section>
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
