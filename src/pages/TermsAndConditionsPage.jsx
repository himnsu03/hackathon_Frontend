import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';

export const TermsAndConditionsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <span className="text-xs font-mono text-slate-500">Hackathon Rules & Terms</span>
      </div>

      <Card
        title="Contata Hackathon 2026 — Terms & Conditions"
        subtitle="Participation Rules, Intellectual Property, and Code of Conduct"
      >
        <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">1. Eligibility</h3>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>Open to current college students and recent graduates aged 18 years or older.</li>
              <li>Candidates must register with legitimate personal credentials. Only one account per candidate is permitted.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">2. Originality & Academic Integrity</h3>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>All project implementations and code must be produced during the hackathon period.</li>
              <li>Plagiarism, submitting pre-existing turn-key commercial projects, or tampering with evaluation tools will result in disqualification.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">3. Intellectual Property</h3>
            <p>
              Participants retain copyright and ownership of the original code created by them. Participants grant Contata Solutions a non-exclusive license to review, test, evaluate, and demonstrate the project for competition and recruiting purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">4. Evaluation & Results</h3>
            <p>
              All projects are scored based on the published evaluation criteria. The decision of the evaluation panel is final and binding.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
};
