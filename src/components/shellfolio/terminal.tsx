"use client";

import React from 'react';
import { TerminalProvider, useTerminal } from '@/lib/terminal/terminal-state';
import { TerminalShellFrame } from './terminal/TerminalShellFrame';
import { TerminalViewport } from './terminal/TerminalViewport';
import { TerminalPromptLine } from './terminal/TerminalPromptLine';
import { TerminalWelcome } from './terminal/TerminalWelcome';
import { QuickActions } from './terminal/QuickActions';

const TerminalContent = () => {
    const { history } = useTerminal();
    
    return (
        <TerminalShellFrame>
            <TerminalViewport>
                {/* Welcome message shown if history is empty or clear was called recently */}
                {history.length === 0 && (
                    <>
                        <TerminalWelcome />
                        <QuickActions />
                    </>
                )}

                {/* Print history of commands and outputs */}
                {history.map(item => (
                    <div key={item.id} className="w-full mb-4 last:mb-0">
                        {item.command && (
                            <div className="flex items-start w-full relative mb-2 opacity-70">
                                <div className="flex items-center shrink-0 mr-3 select-none">
                                    <span style={{ color: 'var(--terminal-prompt-user)' }}>peter</span>
                                    <span className="opacity-50">@</span>
                                    <span style={{ color: 'var(--terminal-prompt-host)' }}>shellfolio</span>
                                    <span className="opacity-60 mx-1">:</span>
                                    <span className="whitespace-nowrap" style={{ color: 'var(--terminal-prompt-path)' }}>~</span>
                                    <span className="ml-2" style={{ color: 'var(--terminal-prompt-symbol)' }}>$</span>
                                </div>
                                <div className="break-all">{item.command}</div>
                            </div>
                        )}
                        <div className="w-full animate-in fade-in duration-300">
                            {item.output}
                        </div>
                    </div>
                ))}
                
                {/* Active Prompt Line at the bottom */}
                <TerminalPromptLine />
            </TerminalViewport>
        </TerminalShellFrame>
    );
};

export function Terminal() {
    return (
        <TerminalProvider>
            <TerminalContent />
        </TerminalProvider>
    );
}