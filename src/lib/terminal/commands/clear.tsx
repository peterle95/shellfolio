import { Command } from '../types';
import { HELP_MENU } from './help-menu';

export const clearCommand: Command = {
    name: 'clear',
    aliases: ['cls'],
    description: HELP_MENU.clear,
    execute: (parsed, ctx) => {
        ctx.clearHistory();
        return ''; // Return empty string so nothing is appended after clearing
    }
};
