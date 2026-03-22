import { ReactNode } from 'react';

// Simplified local VFS Node types for pure TS module
export interface VFSNode {
    type: 'file' | 'directory';
    name: string;
    path: string;
}

export interface VFSFile extends VFSNode {
    type: 'file';
    content?: string | ReactNode;
    fileType: 'text' | 'markdown' | 'json' | 'link' | 'component' | 'pdf';
    targetUrl?: string; // used for links
}

export interface VFSDirectory extends VFSNode {
    type: 'directory';
    children: Record<string, VFSNode>;
}

export class VirtualFileSystem {
    private root: VFSDirectory;

    constructor(initialTree: VFSDirectory) {
        this.root = initialTree;
    }

    public resolve(targetPath: string, cwd: string): string {
        if (targetPath === '~') return '/';
        
        let basePath = targetPath.startsWith('/') ? '/' : cwd;
        const parts = (basePath === '/' ? targetPath : `${basePath}/${targetPath}`).split('/').filter(p => p !== '');
        
        const stack: string[] = [];
        for (const p of parts) {
            if (p === '.') continue;
            if (p === '..') {
                stack.pop();
            } else {
                stack.push(p);
            }
        }
        
        return '/' + stack.join('/');
    }

    public get(absPath: string): VFSNode | null {
        if (absPath === '/') return this.root;
        
        const parts = absPath.split('/').filter(p => p !== '');
        let current: VFSNode = this.root;
        
        for (const p of parts) {
            if (current.type !== 'directory') return null;
            current = (current as VFSDirectory).children[p];
            if (!current) return null;
        }
        
        return current;
    }

    public ls(targetPath: string, cwd: string): VFSNode[] | Error {
        const absPath = this.resolve(targetPath, cwd);
        const node = this.get(absPath);
        
        if (!node) return new Error(`ls: cannot access '${targetPath}': No such file or directory`);
        if (node.type !== 'directory') return [node];
        
        return Object.values((node as VFSDirectory).children).sort((a, b) => {
            // Directories first
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
    }

    public cd(targetPath: string, cwd: string): string | Error {
        const absPath = this.resolve(targetPath, cwd);
        const node = this.get(absPath);
        
        if (!node) return new Error(`cd: ${targetPath}: No such file or directory`);
        if (node.type !== 'directory') return new Error(`cd: ${targetPath}: Not a directory`);
        
        return absPath;
    }

    public cat(targetPath: string, cwd: string): VFSFile | Error {
        const absPath = this.resolve(targetPath, cwd);
        const node = this.get(absPath);
        
        if (!node) return new Error(`cat: ${targetPath}: No such file or directory`);
        if (node.type === 'directory') return new Error(`cat: ${targetPath}: Is a directory`);
        
        return node as VFSFile;
    }
}
