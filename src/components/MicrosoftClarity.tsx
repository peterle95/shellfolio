'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Clarity from '@microsoft/clarity';
import { CONSENT_CHANGED, isAnalyticsAllowed } from './PrivacyConsent';

let clarityInitialized = false;

export function MicrosoftClarity() {
  const pathname = usePathname();

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) return;

    const handleConsent = (event: Event) => {
      const allowed = (event as CustomEvent<{ analytics: boolean }>).detail.analytics;
      Clarity.consent(allowed);
    };
    window.addEventListener(CONSENT_CHANGED, handleConsent);

    if (clarityInitialized || !isAnalyticsAllowed()) {
      if (clarityInitialized && isAnalyticsAllowed()) Clarity.consent(true);
      return () => window.removeEventListener(CONSENT_CHANGED, handleConsent);
    }

    const blockedPaths = [
      '/admin',
      '/login',
      '/register',
      '/account',
      '/dashboard',
      '/checkout',
    ];

    const isBlockedPath = blockedPaths.some((path) =>
      pathname?.startsWith(path)
    );

    if (isBlockedPath) return;

    Clarity.init(projectId);
    clarityInitialized = true;

    return () => window.removeEventListener(CONSENT_CHANGED, handleConsent);
  }, [pathname]);

  return null;
}
