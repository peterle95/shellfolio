import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { Projects } from '@/components/shellfolio/outputs';

export const projectsCommand: Command = {
    name: 'projects',
    aliases: ['portfolio'],
    description: HELP_MENU.projects,
    execute: () => <Projects />,
};
