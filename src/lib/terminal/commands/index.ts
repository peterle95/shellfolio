// src/lib/terminal/commands/index.ts
import { helpCommand } from './help';
import { clearCommand } from './clear';
import { lsCommand } from './ls';
import { cdCommand } from './cd';
import { catCommand } from './cat';
import { pwdCommand } from './pwd';
import { HELP_MENU } from './help-menu';
import type { Command } from '../types';

const lazyCommand = (
    name: string,
    load: () => Promise<Command>,
    aliases?: string[]
): Command => ({
    name,
    aliases,
    description: HELP_MENU[name as keyof typeof HELP_MENU],
    execute: async (parsed, ctx) => (await load()).execute(parsed, ctx),
});

const aboutCommand = lazyCommand('about', async () => (await import('./about')).aboutCommand);
const projectsCommand = lazyCommand('projects', async () => (await import('./projects')).projectsCommand, ['portfolio']);
const educationCommand = lazyCommand('education', async () => (await import('./education')).educationCommand);
const workCommand = lazyCommand('work', async () => (await import('./work')).workCommand, ['experience', 'jobs']);
const cvCommand = lazyCommand('cv', async () => (await import('./cv')).cvCommand, ['resume']);
const contactCommand = lazyCommand('contact', async () => (await import('./contact')).contactCommand, ['social', 'links']);
const credentialsCommand = lazyCommand('credentials', async () => (await import('./credentials')).credentialsCommand, ['certs', 'certifications']);

export const predefinedCommands = [
    helpCommand,
    clearCommand,
    lsCommand,
    cdCommand,
    catCommand,
    pwdCommand,
    aboutCommand,
    projectsCommand,
    educationCommand,
    workCommand,
    cvCommand,
    contactCommand,
    credentialsCommand,
];
