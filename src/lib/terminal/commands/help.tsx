import React from 'react';
import { Command } from '../types';
import { OutputText } from '@/components/shellfolio/terminal/CommandOutput';
import { StructuredRecordsOutput } from '@/components/shellfolio/terminal/StructuredRecordsOutput';

// A bit of a hack to get the predefined commands locally, it won't include dynamically runtime registered ones,
// but for this portfolio it's fine.
import { predefinedCommands } from './index';
import { HELP_MENU, HELP_MENU_ORDER } from './help-menu';

export const helpCommand: Command = {
    name: 'help',
    description: HELP_MENU.help,
    execute: (parsed) => {
        if (parsed.args[0]) {
            const cmd = predefinedCommands.find(c => c.name === parsed.args[0] || c.aliases?.includes(parsed.args[0]));
            if (!cmd) {
                return <OutputText>help: no help topics match `{parsed.args[0]}`</OutputText>;
            }

            const record: Record<string, string> = {
                name: cmd.name,
                description: cmd.description,
            };
            if (cmd.usage) record.usage = cmd.usage;
            if (cmd.aliases?.length) record.aliases = cmd.aliases.join(', ');

            return (
                <div>
                    <StructuredRecordsOutput records={[record]} />
                    <OutputText className="text-sm opacity-60 mt-4">
                        Type `help` for the full command list.
                    </OutputText>
                </div>
            );
        }

        return (
            <div>
                <StructuredRecordsOutput
                    records={HELP_MENU_ORDER.map((name) => ({
                        command: name,
                        description: HELP_MENU[name],
                    }))}
                />
                <OutputText className="text-sm opacity-60 mt-4">
                    Type `help &lt;command&gt;` for more information on a specific command.
                </OutputText>
            </div>
        );
    }
};
