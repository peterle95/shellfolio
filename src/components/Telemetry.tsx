'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';
import { CONSENT_CHANGED, readConsent, type Consent } from './PrivacyConsent';
import { MicrosoftClarity } from './MicrosoftClarity';

export function Telemetry() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());

    const update = (event: Event) => setConsent((event as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_CHANGED, update);
    return () => window.removeEventListener(CONSENT_CHANGED, update);
  }, []);

  if (!consent) return null;
  return <>{consent.analytics && <Analytics />}{consent.performance && <SpeedInsights />}{consent.clarity && <MicrosoftClarity />}</>;
}
