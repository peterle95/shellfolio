import { Command } from '../types';

export const clearCommand: Command = {
    name: 'clear',
    aliases: ['cls'],
    description: 'Clear the terminal output',
    execute: (parsed, ctx) => {
        ctx.clearHistory();
        return ''; // Return empty string so nothing is appended after clearing
    }
};
