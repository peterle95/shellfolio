// src/lib/terminal/commands/index.ts
import { helpCommand } from './help';
import { clearCommand } from './clear';
import { lsCommand } from './ls';
import { cdCommand } from './cd';
import { catCommand } from './cat';
import { pwdCommand } from './pwd';
import { themeCommand } from './theme';
import { themesCommand } from './themes';
import { aboutCommand } from './about';
import { projectsCommand } from './projects';
import { contactCommand } from './contact';

export const predefinedCommands = [
    helpCommand,
    clearCommand,
    lsCommand,
    cdCommand,
    catCommand,
    pwdCommand,
    themeCommand,
    themesCommand,
    aboutCommand,
    projectsCommand,
    contactCommand,
];
