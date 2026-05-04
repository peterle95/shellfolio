"use client";

import React from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { HELP_MENU_ORDER } from '@/lib/terminal/commands/help-menu';

export const QuickActions = () => {
    const { executeCommand } = useTerminal();

    return (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
            {HELP_MENU_ORDER.map((cmd) => (
                <button
                    key={cmd}
                    onClick={() => executeCommand(cmd)}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors border opacity-80 hover:opacity-100"
                    style={{ 
                        borderColor: 'var(--terminal-border)',
                        backgroundColor: 'var(--terminal-header)',
                        color: 'var(--terminal-fg)'
                    }}
                >
                    {cmd}
                </button>
            ))}
        </div>
    );
};
