import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const PrivacyNoticePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <span className="text-xs font-mono text-slate-500">Privacy Notice</span>
      </div>

      <Card
        title="Contata Hackathon 2026 — Privacy Notice"
        subtitle="Effective Date: 19 August 2026 | Last Updated: 19 August 2026"
      >
        <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-xl">
            <p>
              <strong>Contata Solutions</strong> respects your privacy and is committed to protecting your personal data. This Privacy Notice explains how we collect, use, store, protect and process personal data when you register for or participate in <strong>Contata Hackathon 2026</strong>.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              By registering for the Hackathon, you acknowledge that you have read this Privacy Notice and understand how your personal data will be processed.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">1. What Personal Data We Collect</h3>
            <p>We collect personal information necessary for administering the Hackathon, including:</p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>Full name, official email address, mobile/phone number</li>
              <li>College or university name, degree program, and graduation year</li>
              <li>Date of Birth (to verify the 18+ years eligibility criteria)</li>
              <li>Selected tech stack proficiencies, resumes / CV documents</li>
              <li>Hackathon project submissions, GitHub repositories, live demo URLs, and synopsis proposals</li>
              <li>Technical usage data (IP address, browser session metadata, secure authentication cookies)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">2. Why We Collect and Use Your Personal Data</h3>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>To register and verify candidate eligibility.</li>
              <li>To send essential transactional notifications (schedules, sprint start alerts, evaluation status).</li>
              <li>To evaluate project submissions using human expert evaluators and automated AI scoring.</li>
              <li>To award prizes, cash distributions, certificates of participation, and fast-track interview opportunities.</li>
              <li>Where you have explicitly provided separate consent, to notify you of future hackathons and career opportunities.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">3. How We Store and Protect Your Personal Data</h3>
            <p>
              Your participant details, account credentials, and submissions are stored in our secure database with industry-standard password hashing and strict role-based access controls. Uploaded documents (such as resumes) are saved on our dedicated application server with unique identifiers. Access to participant information is strictly restricted to authorized hackathon organizers and assigned evaluators.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">4. Sharing and Third-Party Disclosures</h3>
            <p>
              We do not sell, rent, or trade your personal data. Data is shared strictly with the hackathon evaluation committee, mentors, and essential technology service providers subject to confidentiality agreements.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">5. Data Retention Schedule</h3>
            <p>
              Personal data and submission records are retained for <strong>12 months</strong> following event completion for audit, certificate verification, and hiring pipeline evaluation, after which data is securely purged or anonymized.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">6. Your Privacy Rights</h3>
            <p>
              You have the right to access, update, or request the deletion of your personal data at any time. To request a copy of your stored records, correct any details, or withdraw your participation, please contact our Grievance Officer directly at{' '}
              <a href="mailto:hackathongrievance@contata.com" className="text-orange-400 hover:underline font-semibold">
                hackathongrievance@contata.com
              </a>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">7. Grievance Officer / Privacy Contact</h3>
            <p>
              For any privacy inquiries, grievance redressal, or data-related questions, please write to our designated Data Protection & Grievance Officer at{' '}
              <a href="mailto:hackathongrievance@contata.com" className="text-orange-400 hover:underline font-semibold">
                hackathongrievance@contata.com
              </a>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-orange-400">8. Updates to this Privacy Notice</h3>
            <p>
              We may update this Privacy Notice periodically to reflect operational, legal, or regulatory changes. Any modifications will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
};
