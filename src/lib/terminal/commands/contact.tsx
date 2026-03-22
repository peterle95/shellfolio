import React from 'react';
import { Command } from '../types';

export const contactCommand: Command = {
    name: 'contact',
    aliases: ['social', 'links'],
    description: 'Find out how to reach me',
    execute: (parsed, ctx) => {
        ctx.executeCommand('cat contact/links.json');
        return '';
    }
};
