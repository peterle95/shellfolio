'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Clarity from '@microsoft/clarity';
import { CONSENT_CHANGED, isConsentAllowed } from './PrivacyConsent';

let clarityInitialized = false;

export function MicrosoftClarity() {
  const pathname = usePathname();

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) return;

    const handleConsent = (event: Event) => {
      const allowed = (event as CustomEvent<{ clarity: boolean }>).detail.clarity;
      Clarity.consent(allowed);
    };
    window.addEventListener(CONSENT_CHANGED, handleConsent);

    if (clarityInitialized || !isConsentAllowed('clarity')) {
      if (clarityInitialized && isConsentAllowed('clarity')) Clarity.consent(true);
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

    if (isBlockedPath) return () => window.removeEventListener(CONSENT_CHANGED, handleConsent);

    Clarity.init(projectId);
    clarityInitialized = true;

    return () => window.removeEventListener(CONSENT_CHANGED, handleConsent);
  }, [pathname]);

  return null;
}
