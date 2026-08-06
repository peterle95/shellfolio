'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';
import { CONSENT_CHANGED, isAnalyticsAllowed } from './PrivacyConsent';
import { MicrosoftClarity } from './MicrosoftClarity';

export function Telemetry() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(isAnalyticsAllowed());

    const update = (event: Event) => setAllowed((event as CustomEvent<{ analytics: boolean }>).detail.analytics);
    window.addEventListener(CONSENT_CHANGED, update);
    return () => window.removeEventListener(CONSENT_CHANGED, update);
  }, []);

  if (!allowed) return null;
  return <><Analytics /><SpeedInsights /><MicrosoftClarity /></>;
}
