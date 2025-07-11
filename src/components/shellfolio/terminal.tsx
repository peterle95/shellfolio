"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { commands } from './commands';
import { Welcome, NotFound } from './outputs';
import { Card, CardContent } from "@/components/ui/card";

interface HistoryItem {
    id: number;
    command: string;
    output: React.ReactNode;
}

const Prompt = ({ command }: { command: string }) => (
    <div className="flex">
        <span className="text-primary font-bold mr-2">moelzerpeter$></span>
        <span className="flex-1">{command}</span>
    </div>
);

export function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory([{ id: 0, command: '', output: <Welcome /> }]);
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const processCommand = useCallback((cmd: string) => {
        const [commandName] = cmd.trim().split(' ');

        if (commandName === 'clear') {
            setHistory([]);
            return;
        }

        const output = commands[commandName] ? commands[commandName]() : <NotFound command={commandName} />;
        
        const newHistoryItem: HistoryItem = {
            id: history.length + 1,
            command: cmd,
            output: output,
        };

        setHistory(prev => [...prev, newHistoryItem]);
    }, [history]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (input.trim()) {
                const newCommandHistory = [input, ...commandHistory];
                setCommandHistory(newCommandHistory);
                setHistoryIndex(-1);
                processCommand(input);
                setInput('');
            } else {
                 setHistory(prev => [...prev, {id: prev.length, command: '', output: ''}]);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    return (
        <Card 
            className="w-full h-full p-2 sm:p-4 flex flex-col overflow-hidden shadow-2xl bg-card text-card-foreground border-none" 
            onClick={() => inputRef.current?.focus()}>
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-2 pr-4 space-y-4">
                {history.map((item) => (
                    <div key={item.id}>
                        {item.command && <Prompt command={item.command} />}
                        <div>{item.output}</div>
                    </div>
                ))}
                <div className="flex w-full">
                    <span className="text-primary font-bold mr-2">moelzerpeter$></span>
                    <div className="flex-1 relative">
                        <span className="break-all">{input}</span>
                        <span className="inline-block w-2 h-[1.2em] bg-foreground ml-1 animate-blink align-bottom"></span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none text-transparent caret-transparent"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
