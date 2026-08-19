import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Shield, FileText, Cookie, ShieldCheck, Mail } from 'lucide-react';
import { PrivacyNoticeModal } from './common/PrivacyNoticeModal';
import { TermsModal } from './common/TermsModal';
import { CookieSettingsModal } from './common/CookieSettingsModal';
import { GrievanceOfficerModal } from './common/GrievanceOfficerModal';

export const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Privacy & Compliance Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-y-3 gap-x-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-orange-500/80" /> Privacy Notice
              </button>

              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Terms & Conditions
              </button>

              <button
                type="button"
                onClick={() => setShowCookieModal(true)}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Cookie className="w-3.5 h-3.5 text-slate-500" /> Cookie Settings
              </button>

              <button
                type="button"
                onClick={() => setShowGrievanceModal(true)}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" /> Grievance Officer
              </button>

              <a
                href="mailto:hackathongrievance@contata.com"
                className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Contact Us
              </a>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <Link to="/results" className="hover:text-slate-300 transition-colors">Results</Link>
              <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
            </div>
          </div>

          {/* Brand & Copyright Row (Placed Below) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-slate-400">Contata Solutions Hackathon 2026</span>
            </div>

            <div>
              <span>© 2026 Contata Solutions. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Compliance Modals */}
      <PrivacyNoticeModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <CookieSettingsModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
      />

      <GrievanceOfficerModal
        isOpen={showGrievanceModal}
        onClose={() => setShowGrievanceModal(false)}
      />
    </>
  );
};
