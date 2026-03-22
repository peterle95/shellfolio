import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { Education } from '@/components/shellfolio/outputs';

export const educationCommand: Command = {
    name: 'education',
    description: HELP_MENU.education,
    execute: () => <Education />,
};
