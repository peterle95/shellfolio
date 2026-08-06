'use client';

import { useEffect, useRef, useState } from 'react';

const CONSENT_KEY = 'shellfolio_privacy_consent';
const CONSENT_CHANGED = 'shellfolio:consent-changed';
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export type Consent = {
  analytics: boolean;
  performance: boolean;
  clarity: boolean;
  updatedAt: number;
};

let sessionConsent: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null') as Consent | null;
    if (!value || typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) || value.updatedAt > Date.now() || typeof value.analytics !== 'boolean' || typeof value.performance !== 'boolean' || typeof value.clarity !== 'boolean' || Date.now() - value.updatedAt > CONSENT_MAX_AGE) return null;
    return value;
  } catch {
    return sessionConsent;
  }
}

export function isConsentAllowed(key: keyof Omit<Consent, 'updatedAt'>) {
  return readConsent()?.[key] === true;
}

function saveConsent(value: Omit<Consent, 'updatedAt'>) {
  const consent = { ...value, updatedAt: Date.now() };
  sessionConsent = consent;
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Continue for this session when browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: consent }));
}

export function PrivacyConsent() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, performance: false, clarity: false });
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openSettings = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setDraft(consent ?? { analytics: false, performance: false, clarity: false });
    setOpen(true);
  };

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setDraft(stored ?? { analytics: false, performance: false, clarity: false });
    setOpen(stored === null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button, input'));
    focusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        choose({ analytics: false, performance: false, clarity: false });
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = focusable();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (consent === undefined || !open) {
    return consent && !open ? (
      <button
        type="button"
        onClick={openSettings}
        className="fixed bottom-3 left-3 z-50 rounded border border-white/30 bg-black/80 px-3 py-2 text-xs text-white underline focus:outline-none focus:ring-2 focus:ring-white"
      >
        Privacy settings
      </button>
    ) : null;
  }

  const choose = (value: Omit<Consent, 'updatedAt'>) => {
    saveConsent(value);
    setConsent({ ...value, updatedAt: Date.now() });
    setOpen(false);
    previousFocusRef.current?.focus();
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      aria-describedby="privacy-description"
      ref={dialogRef}
      className="fixed inset-x-3 bottom-3 z-50 max-w-xl rounded-lg border border-white/30 bg-black p-4 text-sm text-white shadow-2xl sm:left-6"
    >
      <h2 id="privacy-title" className="mb-2 text-base font-bold">Privacy settings</h2>
      <p id="privacy-description" className="mb-4 text-white/80">
        This site uses necessary first-party storage for preferences and terminal features. Optional analytics and session insights are off until you allow them. You can change this choice anytime.
      </p>
      <fieldset className="mb-4 space-y-2">
        <legend className="sr-only">Optional services</legend>
        {([
          ['analytics', 'Vercel Analytics'],
          ['performance', 'Vercel Speed Insights'],
          ['clarity', 'Microsoft Clarity session insights'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input type="checkbox" checked={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => choose(draft)} className="rounded border border-white px-3 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300">Save choices</button>
        <button type="button" onClick={() => choose({ analytics: false, performance: false, clarity: false })} className="rounded border border-white px-3 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300">Reject all</button>
      </div>
    </aside>
  );
}

export { CONSENT_CHANGED, CONSENT_KEY };
