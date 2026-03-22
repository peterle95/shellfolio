import React from 'react';
import { Command } from '../types';

export const aboutCommand: Command = {
    name: 'about',
    description: 'Display information about me',
    execute: (parsed, ctx) => {
        ctx.executeCommand('cat about/bio.txt');
        return '';
    }
};
