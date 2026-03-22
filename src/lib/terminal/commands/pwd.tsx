import React from 'react';
import { Command } from '../types';
import { OutputText } from '@/components/shellfolio/terminal/CommandOutput';

export const pwdCommand: Command = {
    name: 'pwd',
    description: 'Print name of current/working directory',
    execute: (parsed, ctx) => {
        return <OutputText>{ctx.cwd}</OutputText>;
    }
};
