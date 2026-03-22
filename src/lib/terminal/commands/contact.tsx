import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { Contact } from '@/components/shellfolio/outputs';

export const contactCommand: Command = {
    name: 'contact',
    aliases: ['social', 'links'],
    description: HELP_MENU.contact,
    execute: () => <Contact />,
};
