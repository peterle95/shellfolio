import React from 'react';
import { Command } from '../types';
import { OutputError, OutputSuccess } from '@/components/shellfolio/terminal/CommandOutput';

export const themeCommand: Command = {
    name: 'theme',
    description: 'Change the terminal theme',
    usage: 'theme <name>',
    examples: ['theme dracula', 'theme ubuntu'],
    execute: (parsed, ctx) => {
        if (!parsed.args[0]) {
            return <OutputError>Usage: theme &lt;name&gt;. Type `themes` to see available themes.</OutputError>;
        }

        const success = ctx.themeManager.setTheme(parsed.args[0]);
        if (success) {
            return <OutputSuccess>Theme changed to {parsed.args[0]}.</OutputSuccess>;
        }

        return <OutputError>Theme "{parsed.args[0]}" not found. Type `themes` to see available themes.</OutputError>;
    },
    autocomplete: (partial, ctx) => {
        const partialName = partial.split(' ')[1] || '';
        return ctx.themeManager.getAvailableThemes().filter(t => t.startsWith(partialName));
    }
};
