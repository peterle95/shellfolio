"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { VirtualFileSystem } from './virtual-filesystem';
import { HistoryStore } from './history-store';
import { CommandRegistry } from './command-registry';
import { AutocompleteEngine } from './autocomplete-engine';
import { portfolioContent } from './vfs-content';
import { predefinedCommands } from './commands';
import { HistoryItem, CommandContext, ParsedCommand } from './types';
import { CommandParser } from './command-parser';

// Default instances
const vfsInstance = new VirtualFileSystem(portfolioContent);
const historyStoreInstance = typeof window !== 'undefined' ? new HistoryStore(200) : null;
const registryInstance = new CommandRegistry();
predefinedCommands.forEach(cmd => registryInstance.register(cmd));
const autocompleteInstance = new AutocompleteEngine(registryInstance);

interface TerminalProviderState {
    cwd: string;
    setCwd: (path: string) => void;
    history: HistoryItem[];
    pushHistory: (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
    executeCommand: (cmdStr: string) => void;
    vfs: VirtualFileSystem;
    historyStore: HistoryStore | null;
    registry: CommandRegistry;
    autocomplete: AutocompleteEngine;
}

const TerminalContext = createContext<TerminalProviderState | null>(null);

export const useTerminal = () => {
    const context = useContext(TerminalContext);
    if (!context) {
        throw new Error('useTerminal must be used within a TerminalProvider');
    }
    return context;
};

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
    const [cwd, setCwd] = useState('/');
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (historyStoreInstance) {
            setHistory(historyStoreInstance.getAll());
        }
    }, []);

    const clearHistory = useCallback(() => {
        if (historyStoreInstance) {
            historyStoreInstance.clear();
            setHistory([]);
        }
    }, []);

    const pushHistory = useCallback((entry: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        if (historyStoreInstance) {
            historyStoreInstance.push(entry);
            setHistory(historyStoreInstance.getAll());
        }
    }, []);

    const executeCommand = useCallback((cmdStr: string) => {
        if (!cmdStr.trim()) {
            pushHistory({ command: '', output: '' });
            return;
        }

        const parsed = CommandParser.parse(cmdStr);
        
        const ctx: CommandContext = {
            cwd,
            setCwd,
            vfs: vfsInstance,
            historyStore: historyStoreInstance as HistoryStore,
            pushHistory,
            clearHistory,
            executeCommand: executeCommand // Allow commands to trigger other commands
        };

        const output = registryInstance.execute(parsed, ctx);
        pushHistory({ command: cmdStr, output });
        if (historyStoreInstance) {
            historyStoreInstance.resetNavigation();
        }
    }, [cwd, pushHistory, clearHistory]);

    const value: TerminalProviderState = {
        cwd,
        setCwd,
        history,
        pushHistory,
        clearHistory,
        executeCommand,
        vfs: vfsInstance,
        historyStore: historyStoreInstance,
        registry: registryInstance,
        autocomplete: autocompleteInstance
    };

    return (
        <TerminalContext.Provider value={value}>
            {children}
        </TerminalContext.Provider>
    );
};
