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
import { educationCommand } from './education';
import { workCommand } from './work';
import { cvCommand } from './cv';
import { contactCommand } from './contact';
import { credentialsCommand } from './credentials';

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
    educationCommand,
    workCommand,
    cvCommand,
    contactCommand,
    credentialsCommand,
];
