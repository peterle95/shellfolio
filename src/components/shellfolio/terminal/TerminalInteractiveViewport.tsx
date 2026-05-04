"use client";

import React, { ReactNode } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { TerminalPromptLine } from './TerminalPromptLine';
import { TerminalViewport } from './TerminalViewport';

export function TerminalInteractiveViewport({ children }: { children: ReactNode }) {
    const { history } = useTerminal();

    return (
        <TerminalViewport>
            {history.length === 0 && children}

            {history.map(item => (
                <div key={item.id} className="w-full mb-4 last:mb-0">
                    {item.command && (
                        <div className="flex items-start w-full relative mb-2 opacity-70">
                            <div className="flex items-center shrink-0 mr-3 select-none">
                                <span style={{ color: 'var(--terminal-prompt-user)' }}>moelzerpeter</span>
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

            <TerminalPromptLine />
        </TerminalViewport>
    );
}
