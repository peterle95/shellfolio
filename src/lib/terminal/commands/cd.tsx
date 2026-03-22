import React from 'react';
import { Command } from '../types';
import { OutputError } from '@/components/shellfolio/terminal/CommandOutput';

export const cdCommand: Command = {
    name: 'cd',
    description: 'Change the shell working directory',
    usage: 'cd [dir]',
    execute: (parsed, ctx) => {
        const target = parsed.args[0] || '/';
        const res = ctx.vfs.cd(target, ctx.cwd);

        if (res instanceof Error) {
            return <OutputError>{res.message}</OutputError>;
        }

        ctx.setCwd(res);
        return '';
    }
};
