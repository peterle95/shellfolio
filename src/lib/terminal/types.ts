import { ReactNode } from 'react';
import { VirtualFileSystem } from './virtual-filesystem';
import { HistoryStore } from './history-store';

export interface VFSNode {
    type: 'file' | 'directory';
    name: string;
    path: string;
    children?: Record<string, VFSNode>;
    content?: string | ReactNode;
    fileType?: 'text' | 'markdown' | 'json' | 'pdf' | 'link' | 'component';
    targetUrl?: string;
}

export interface VFSFile extends VFSNode {
    type: 'file';
    content: string | ReactNode;
    fileType: 'text' | 'markdown' | 'json' | 'pdf' | 'link' | 'component';
    targetUrl?: string; // used for links
}

export interface VFSDirectory extends VFSNode {
    type: 'directory';
    children: Record<string, VFSNode>;
}

export interface ParsedCommand {
    name: string;
    args: string[];
    flags: Record<string, string | boolean>;
    raw: string;
}

export interface HistoryItem {
    id: number;
    command: string;
    output: ReactNode;
    timestamp: number;
}

export interface CommandContext {
    cwd: string;
    setCwd: (path: string) => void;
    vfs: VirtualFileSystem;
    historyStore: HistoryStore;
    pushHistory: (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
    executeCommand: (cmdStr: string) => void;
    autocomplete?: any; // Avoiding circular dependency for now
}

export interface Command {
    name: string;
    aliases?: string[];
    description: string;
    usage?: string;
    examples?: string[];
    execute: (parsed: ParsedCommand, ctx: CommandContext) => string | ReactNode;
    autocomplete?: (partial: string, ctx: CommandContext) => string[];
}

export interface ThemeTokens {
    name: string;
    cssVars: Record<string, string>;
}
