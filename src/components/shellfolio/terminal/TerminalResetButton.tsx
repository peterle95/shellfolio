"use client";

import { CornerUpLeft } from 'lucide-react';
import { useTerminal } from '@/lib/terminal/terminal-state';

export function TerminalResetButton() {
    const { history, clearHistory, setCwd } = useTerminal();

    if (history.length === 0) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={() => {
                setCwd('/');
                clearHistory();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors border opacity-80 hover:opacity-100"
            style={{
                borderColor: 'var(--terminal-border)',
                backgroundColor: 'var(--terminal-header)',
                color: 'var(--terminal-fg)',
            }}
            aria-label="Back to welcome screen"
        >
            <CornerUpLeft className="w-3.5 h-3.5" />
            back
        </button>
    );
}
