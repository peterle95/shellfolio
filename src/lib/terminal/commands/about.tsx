import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { About } from '@/components/shellfolio/outputs';

export const aboutCommand: Command = {
    name: 'about',
    description: HELP_MENU.about,
    execute: () => <About />,
};
