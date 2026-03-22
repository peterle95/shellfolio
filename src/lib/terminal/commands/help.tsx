import React from 'react';
import { Command } from '../types';
import { OutputText, OutputHeading, OutputDivider } from '@/components/shellfolio/terminal/CommandOutput';

// A bit of a hack to get the predefined commands locally, it won't include dynamically runtime registered ones,
// but for this portfolio it's fine.
import { predefinedCommands } from './index';
import { HELP_MENU, HELP_MENU_ORDER } from './help-menu';

export const helpCommand: Command = {
    name: 'help',
    description: HELP_MENU.help,
    execute: (parsed, ctx) => {
        if (parsed.args[0]) {
            const cmd = predefinedCommands.find(c => c.name === parsed.args[0] || c.aliases?.includes(parsed.args[0]));
            if (!cmd) {
                return <OutputText>help: no help topics match `{parsed.args[0]}`</OutputText>;
            }
            
            return (
                <div>
                    <OutputHeading>{cmd.name}</OutputHeading>
                    <OutputText>{cmd.description}</OutputText>
                    {cmd.usage && <OutputText><span className="opacity-50">Usage:</span> {cmd.usage}</OutputText>}
                    {cmd.aliases && <OutputText><span className="opacity-50">Aliases:</span> {cmd.aliases.join(', ')}</OutputText>}
                </div>
            );
        }

        return (
            <div>
                <OutputHeading>Available Commands</OutputHeading>
                <OutputDivider />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4">
                    {HELP_MENU_ORDER.map((name) => (
                        <div key={name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                            <span 
                                className="font-bold min-w-[100px]" 
                                style={{ color: 'var(--terminal-prompt-user)' }}
                            >
                                {name}
                            </span>
                            <span className="opacity-80 text-sm">{HELP_MENU[name]}</span>
                        </div>
                    ))}
                </div>
                <OutputDivider />
                <OutputText className="text-sm opacity-60 mt-4">
                    Type `help &lt;command&gt;` for more information on a specific command.
                </OutputText>
            </div>
        );
    }
};
