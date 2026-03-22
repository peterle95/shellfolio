import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { Cv } from '@/components/shellfolio/outputs';

export const cvCommand: Command = {
    name: 'cv',
    aliases: ['resume'],
    description: HELP_MENU.cv,
    execute: () => <Cv />,
};
