'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Clarity from '@microsoft/clarity';

let clarityInitialized = false;

export function MicrosoftClarity() {
  const pathname = usePathname();

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) return;
    if (clarityInitialized) return;

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
  }, [pathname]);

  return null;
}