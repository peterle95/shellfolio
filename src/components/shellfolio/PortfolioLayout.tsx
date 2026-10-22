"use client";

import type { ReactNode } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { VisualEffects } from './VisualEffects';

export function PortfolioLayout({ children }: { children: ReactNode }) {
    const { activeSection } = useTerminal();
    const projectsOpen = activeSection === 'projects';

    return (
        <>
            <VisualEffects showBadge={!projectsOpen} />
            <div className="relative z-10 w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col min-[1400px]:flex-row gap-0 min-[1400px]:gap-8">
                {!projectsOpen && <div aria-hidden="true" className="hidden min-[1400px]:flex min-[1400px]:w-1/3 shrink-0" />}
                <div className="w-full min-[1400px]:flex-1 h-full min-w-0">
                    {children}
                </div>
            </div>
        </>
    );
}
