import React, { useState, useRef, useEffect } from 'react';
import { useTerminal } from '@/lib/terminal/terminal-state';

export const TerminalPromptLine = ({
    autoFocus = true
}: {
    autoFocus?: boolean
}) => {
    const { cwd, executeCommand, historyStore, autocomplete, registry, vfs } = useTerminal();
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus on mount and when clicking anywhere in the terminal
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }

        const handleGlobalClick = () => {
            if (window.getSelection()?.toString().length === 0) {
                inputRef.current?.focus();
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [autoFocus]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyStore) {
                const prev = historyStore.prev();
                if (prev !== null) setInput(prev);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyStore) {
                const next = historyStore.next();
                if (next !== null) setInput(next);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Basic autocomplete
            if (!input.trim()) return;
            const context = {
                cwd,
                vfs,
                autocomplete,
                historyStore,
                pushHistory: () => {},
                clearHistory: () => {},
                executeCommand,
                setCwd: () => {}
            };
            const completions = autocomplete.complete(input, context);
        } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            executeCommand('clear');
            setInput('');
        }
    };

    return (
        <div className="flex items-start w-full relative mt-2 group/prompt">
            <div className="flex items-center shrink-0 mr-3 select-none">
                <span className="font-bold" style={{ color: 'var(--terminal-prompt-user)' }}>moelzerpeter</span>
                <span className="opacity-50">@</span>
                <span className="font-bold" style={{ color: 'var(--terminal-prompt-host)' }}>shellfolio</span>
                <span className="opacity-60 mx-1">:</span>
                <span className="font-bold whitespace-nowrap" style={{ color: 'var(--terminal-prompt-path)' }}>
                    {cwd === '/' ? '~' : cwd}
                </span>
                <span className="ml-2 font-bold" style={{ color: 'var(--terminal-prompt-symbol)' }}>$</span>
            </div>
            
            <div className="flex-1 relative min-h-[1.5em] flex">
                <span className="whitespace-pre-wrap break-all pointer-events-none z-10">{input}</span>
                <span 
                    className="inline-block w-2.5 h-[1.2em] animate-[blink_1s_step-end_infinite] shrink-0 ml-[1px] translate-y-[2px]" 
                    style={{ backgroundColor: 'var(--terminal-caret)' }}
                ></span>
                
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text outline-none p-0 m-0 z-0 text-[16px]"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-label="Terminal input"
                />
            </div>
        </div>
    );
};
