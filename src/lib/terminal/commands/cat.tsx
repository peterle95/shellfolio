import React from 'react';
import { Command } from '../types';
import { OutputError, OutputText, OutputCode, OutputHeading, OutputLink } from '@/components/shellfolio/terminal/CommandOutput';

export const catCommand: Command = {
    name: 'cat',
    description: 'Read the contents of a file',
    usage: 'cat <file>',
    examples: ['cat about/bio.txt'],
    execute: (parsed, ctx) => {
        if (parsed.args.length === 0) {
            return <OutputError>cat: missing file operand</OutputError>;
        }

        const target = parsed.args[0];
        const res = ctx.vfs.cat(target, ctx.cwd);

        if (res instanceof Error) {
            return <OutputError>{res.message}</OutputError>;
        }

        switch (res.fileType) {
            case 'text':
                return <OutputText className="whitespace-pre-wrap">{res.content}</OutputText>;
            case 'json':
                return <OutputCode>{res.content}</OutputCode>;
            case 'markdown':
                // Basic markdown rendering simulation for now
                return <OutputText className="whitespace-pre-wrap">{res.content}</OutputText>;
            case 'link':
            case 'pdf':
                return (
                    <OutputText>
                        File points to an external resource.{' '}
                        <OutputLink href={res.targetUrl!}>Click here to open</OutputLink>.
                    </OutputText>
                );
            default:
                return <OutputText>{res.content as React.ReactNode}</OutputText>;
        }
    },
    autocomplete: (partial, ctx) => {
        return ctx.autocomplete?.completePath(partial.split(' ')[1] || '', ctx.cwd, ctx.vfs) || [];
    }
};
