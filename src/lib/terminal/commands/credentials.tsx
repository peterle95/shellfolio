import React from 'react';
import { Command } from '../types';
import { HELP_MENU } from './help-menu';
import { Credentials } from '@/components/shellfolio/outputs';

export const credentialsCommand: Command = {
    name: 'credentials',
    aliases: ['certs', 'certifications'],
    description: HELP_MENU.credentials,
    execute: () => <Credentials />,
};
