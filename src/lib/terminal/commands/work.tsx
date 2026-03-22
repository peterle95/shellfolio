import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { WorkExperience } from '@/components/shellfolio/outputs';

export const workCommand: Command = {
    name: 'work',
    aliases: ['experience', 'jobs'],
    description: HELP_MENU.work,
    execute: () => <WorkExperience />,
};
