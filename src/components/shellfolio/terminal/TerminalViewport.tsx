import React, { useRef, useEffect } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { CommandParser } from '@/lib/terminal/command-parser';

export const TerminalViewport = ({ 
    children 
}: { 
    children: React.ReactNode 
}) => {
    const { history, registry } = useTerminal();
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    // Start a long showcase at its first card, not at the prompt below all seven.
    useEffect(() => {
        if (scrollViewportRef.current) {
            const el = scrollViewportRef.current;
            const latest = history[history.length - 1];
            const command = CommandParser.parse(latest?.command || '');
            const entries = el.querySelectorAll<HTMLElement>('[data-terminal-entry]');
            const entry = entries[entries.length - 1];
            if (registry.get(command.name)?.name === 'projects' && React.isValidElement(latest?.output) && entry) {
                el.scrollTop += entry.getBoundingClientRect().top - el.getBoundingClientRect().top;
            } else {
                el.scrollTop = el.scrollHeight;
            }
        }
    }, [history, registry]);

    return (
        <div
            ref={scrollViewportRef}
            role="region"
            aria-label="Terminal history"
            tabIndex={0}
            className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden terminal-scrollbar-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--terminal-link)]"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <div className="flex flex-col gap-6 pr-4 pb-4 w-full text-sm sm:text-base selection:bg-[var(--terminal-selection)]">
                {children}
            </div>
        </div>
    );
};
