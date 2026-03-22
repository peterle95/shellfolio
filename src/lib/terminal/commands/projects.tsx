import React from 'react';
import { Command } from '../types';

export const projectsCommand: Command = {
    name: 'projects',
    aliases: ['portfolio'],
    description: 'List my recent projects',
    execute: (parsed, ctx) => {
        ctx.executeCommand('ls projects');
        return '';
    }
};

// We could make a project command for deep dives, but for now ls/cat on projects/ works well enough.
// Shell UX prefers cat projects/transcendence.json over custom non-standard command.
