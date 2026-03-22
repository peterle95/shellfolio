import React, { useRef, useEffect } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParsedCommand } from '@/lib/terminal/types';

export const TerminalViewport = ({ 
    children 
}: { 
    children: React.ReactNode 
}) => {
    const { history } = useTerminal();
    const scrollViewportRef = useRef<HTMLDivElement>(null as any);

    // Auto-scroll to bottom on new history item
    useEffect(() => {
        if (scrollViewportRef.current) {
            const el = scrollViewportRef.current;
            // Native DOM scroll is more reliable than smooth scrolling for terminals
            el.scrollTop = el.scrollHeight;
        }
    }, [history]);

    return (
        <ScrollArea 
            className="flex-1 h-full w-full" 
            viewportRef={scrollViewportRef}
        >
            <div className="flex flex-col gap-6 pr-4 pb-4 w-full text-sm sm:text-base selection:bg-[var(--terminal-selection)]">
                {children}
            </div>
        </ScrollArea>
    );
};
