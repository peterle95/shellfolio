import React, { ReactNode } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';
import { Maximize2, Minus, X } from 'lucide-react';

export const TerminalShellFrame = ({ children }: { children: ReactNode }) => {
    const { theme } = useTerminal();

    return (
        <div 
            className="w-full h-full flex flex-col overflow-hidden shadow-2xl rounded-xl transition-colors duration-300"
            style={{ 
                backgroundColor: 'var(--terminal-bg)',
                borderColor: 'var(--terminal-border)',
                borderWidth: '1px',
                color: 'var(--terminal-fg)',
                fontFamily: 'var(--font-code, monospace)' // ensure mono font
            }}
        >
            {/* Window Chrome Title Bar */}
            <div 
                className="flex items-center px-4 py-3 shrink-0 select-none border-b transition-colors duration-300"
                style={{ 
                    backgroundColor: 'var(--terminal-header)',
                    borderColor: 'var(--terminal-border)'
                }}
            >
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center group/btn relative cursor-pointer">
                        <X className="w-2 h-2 text-black/50 opacity-0 group-hover/btn:opacity-100" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center group/btn relative cursor-pointer">
                        <Minus className="w-2 h-2 text-black/50 opacity-0 group-hover/btn:opacity-100" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center group/btn relative cursor-pointer">
                        <Maximize2 className="w-2 h-2 text-black/50 opacity-0 group-hover/btn:opacity-100" />
                    </div>
                </div>

                {/* Session Title */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide opacity-80">
                        <span style={{ color: 'var(--terminal-prompt-user)' }}>peter</span>
                        <span className="opacity-50">@</span>
                        <span style={{ color: 'var(--terminal-prompt-host)' }}>shellfolio</span>
                        <span className="opacity-50 mx-1">—</span>
                        <span className="opacity-70 font-normal">~</span>
                    </div>
                </div>

                {/* Spacer for centering */}
                <div className="w-[52px]"></div>
            </div>

            {/* Terminal Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col p-2 sm:p-4">
                {children}
            </div>
        </div>
    );
};
