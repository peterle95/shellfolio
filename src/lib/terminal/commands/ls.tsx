import React from 'react';
import { Command } from '../types';
import { OutputError, OutputText } from '@/components/shellfolio/terminal/CommandOutput';

export const lsCommand: Command = {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [path]',
    execute: (parsed, ctx) => {
        const target = parsed.args[0] || '.';
        const res = ctx.vfs.ls(target, ctx.cwd);

        if (res instanceof Error) {
            return <OutputError>{res.message}</OutputError>;
        }

        return (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                {res.map(node => (
                    <span 
                        key={node.name}
                        className={node.type === 'directory' ? 'font-bold' : ''}
                        style={{ color: node.type === 'directory' ? 'var(--terminal-prompt-path)' : 'inherit' }}
                    >
                        {node.name}{node.type === 'directory' ? '/' : ''}
                    </span>
                ))}
            </div>
        );
    },
    autocomplete: (partial, ctx) => {
        // Need to pass autocomplete function here
        // The AutocompleteEngine is intercepting this though
        return [];
    }
};
