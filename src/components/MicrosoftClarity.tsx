'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGED, isConsentAllowed } from './PrivacyConsent';

let clarityInitialized = false;
let clarity: typeof import('@microsoft/clarity').default | undefined;

export function MicrosoftClarity() {
  const pathname = usePathname();

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) return;

    const handleConsent = (event: Event) => {
      const allowed = (event as CustomEvent<{ clarity: boolean }>).detail.clarity;
      clarity?.consent(allowed);
    };
    window.addEventListener(CONSENT_CHANGED, handleConsent);

    if (clarityInitialized || !isConsentAllowed('clarity')) {
      if (clarityInitialized && isConsentAllowed('clarity')) clarity?.consent(true);
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

    let cancelled = false;
    let idleId: number | undefined;
    let delayId: ReturnType<typeof setTimeout> | undefined;

    const initialize = async () => {
      const module = await import('@microsoft/clarity');
      if (cancelled || clarityInitialized || !isConsentAllowed('clarity')) return;
      clarity = module.default;
      clarity.init(projectId);
      clarityInitialized = true;
    };

    const schedule = () => {
      delayId = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(() => void initialize(), { timeout: 2000 });
        } else {
          void initialize();
        }
      }, 6000);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      if (delayId) clearTimeout(delayId);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      window.removeEventListener('load', schedule);
      window.removeEventListener(CONSENT_CHANGED, handleConsent);
    };
  }, [pathname]);

  return null;
}
