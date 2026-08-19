import React, { useState, useEffect } from 'react';
import { CookieSettingsModal } from './CookieSettingsModal';

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('contata_cookie_preferences');
      if (!consent) {
        // Show after small initial delay
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const handleGotIt = () => {
    localStorage.setItem(
      'contata_cookie_preferences',
      JSON.stringify({ essential: true, functional: true, analytics: true, timestamp: new Date().toISOString() })
    );
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#1e293b] border-t border-slate-700/80 shadow-2xl py-3 px-4 sm:px-8 animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-slate-200 leading-normal">
              This website uses cookies to ensure you get the best experience on our website.{' '}
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="underline hover:text-white text-slate-300 font-medium transition-colors cursor-pointer ml-1"
              >
                Learn more
              </button>
            </p>

            <button
              type="button"
              onClick={handleGotIt}
              className="px-6 py-1.5 bg-[#4dd0e1] hover:bg-[#26c6da] active:bg-[#00acc1] text-slate-950 font-bold text-xs sm:text-sm rounded transition-colors shrink-0 shadow cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <CookieSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={() => {
          setShowSettingsModal(false);
          setVisible(false);
        }}
      />
    </>
  );
};
