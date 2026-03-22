import { Command, CommandContext, ParsedCommand } from './types';
import { ReactNode } from 'react';

export class CommandRegistry {
    private commands: Map<string, Command> = new Map();
    private aliases: Map<string, string> = new Map();

    register(command: Command) {
        this.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                this.aliases.set(alias, command.name);
            }
        }
    }

    get(name: string): Command | undefined {
        const resolvedName = this.aliases.get(name) || name;
        return this.commands.get(resolvedName);
    }

    getAll(): Command[] {
        return Array.from(this.commands.values());
    }

    execute(parsed: ParsedCommand, ctx: CommandContext): ReactNode | string {
        if (!parsed.name) {
            return '';
        }

        const command = this.get(parsed.name);
        if (!command) {
            return `command not found: ${parsed.name}`;
        }

        try {
            return command.execute(parsed, ctx);
        } catch (error) {
            console.error(`Error executing ${parsed.name}:`, error);
            return `error executing ${parsed.name}: ${(error as Error).message}`;
        }
    }

    autocomplete(partial: string, ctx: CommandContext): string[] {
        const command = this.get(partial.split(' ')[0]);
        if (command && command.autocomplete) {
            return command.autocomplete(partial, ctx);
        }

        // Default: autocomplete available command names
        const allNames = [
            ...Array.from(this.commands.keys()),
            ...Array.from(this.aliases.keys())
        ];
        return allNames.filter(name => name.startsWith(partial));
    }

    suggest(name: string): string[] {
        // Simple Levenshtein distance for typos could be implemented here.
        // For now, return a simple filter or empty array.
        return [];
    }
}
