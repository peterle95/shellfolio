import React from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';

export const QuickActions = () => {
    const { executeCommand } = useTerminal();

    const actions = [
        { label: 'help', cmd: 'help' },
        { label: 'about', cmd: 'about' },
        { label: 'projects', cmd: 'projects' },
        { label: 'cv', cmd: 'cv' },
        { label: 'contact', cmd: 'contact' },
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
            {actions.map((action) => (
                <button
                    key={action.cmd}
                    onClick={() => executeCommand(action.cmd)}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors border opacity-80 hover:opacity-100"
                    style={{ 
                        borderColor: 'var(--terminal-border)',
                        backgroundColor: 'var(--terminal-header)',
                        color: 'var(--terminal-fg)'
                    }}
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
};
