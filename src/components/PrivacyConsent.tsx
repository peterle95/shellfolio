'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'shellfolio_privacy_consent';
const CONSENT_CHANGED = 'shellfolio:consent-changed';
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

type Consent = { analytics: boolean; updatedAt: number };

export function readConsent(): Consent | null {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null') as Consent | null;
    if (!value || typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) || typeof value.analytics !== 'boolean' || Date.now() - value.updatedAt > CONSENT_MAX_AGE) return null;
    return value;
  } catch {
    return null;
  }
}

export function isAnalyticsAllowed() {
  return readConsent()?.analytics === true;
}

function saveConsent(analytics: boolean) {
  const value = { analytics, updatedAt: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    // Continue for this session when browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: value }));
}

export function PrivacyConsent() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setOpen(stored === null);
  }, []);

  if (consent === undefined || !open) {
    return consent && !open ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-3 left-3 z-50 rounded border border-white/30 bg-black/80 px-3 py-2 text-xs text-white underline focus:outline-none focus:ring-2 focus:ring-white"
      >
        Privacy settings
      </button>
    ) : null;
  }

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setConsent({ analytics, updatedAt: Date.now() });
    setOpen(false);
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      aria-describedby="privacy-description"
      className="fixed inset-x-3 bottom-3 z-50 max-w-xl rounded-lg border border-white/30 bg-black p-4 text-sm text-white shadow-2xl sm:left-6"
    >
      <h2 id="privacy-title" className="mb-2 text-base font-bold">Privacy settings</h2>
      <p id="privacy-description" className="mb-4 text-white/80">
        This site uses necessary first-party storage for preferences and terminal features. Optional analytics and session insights are off until you allow them. You can change this choice anytime.
      </p>
      <div className="flex flex-wrap gap-2">
        <button autoFocus type="button" onClick={() => choose(true)} className="rounded bg-white px-3 py-2 font-semibold text-black focus:outline-none focus:ring-2 focus:ring-fuchsia-300">Allow analytics</button>
        <button type="button" onClick={() => choose(false)} className="rounded border border-white px-3 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300">Reject analytics</button>
      </div>
    </aside>
  );
}

export { CONSENT_CHANGED, CONSENT_KEY };
