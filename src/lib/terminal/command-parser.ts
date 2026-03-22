import { ParsedCommand } from './types';

export class CommandParser {
    /**
     * Parses a raw command string into name, args, and flags.
     * Respects single and double quotes for grouped arguments.
     * Supports boolean flags (-f, --flag) and value flags (--key=value).
     */
    static parse(raw: string): ParsedCommand {
        const tokens = this.tokenize(raw);
        if (tokens.length === 0) {
            return { name: '', args: [], flags: {}, raw };
        }

        const name = tokens[0];
        const args: string[] = [];
        const flags: Record<string, string | boolean> = {};

        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token.startsWith('--')) {
                const parts = token.slice(2).split('=');
                const key = parts[0];
                if (parts.length > 1) {
                    flags[key] = parts.slice(1).join('=');
                } else {
                    flags[key] = true;
                }
            } else if (token.startsWith('-') && token !== '-') {
                // Handle short flags (e.g. -zxvf)
                const shortFlags = token.slice(1);
                for (const char of shortFlags) {
                    flags[char] = true;
                }
            } else {
                args.push(token);
            }
        }

        return { name, args, flags, raw };
    }

    private static tokenize(input: string): string[] {
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const tokens: string[] = [];
        let match;

        while ((match = regex.exec(input)) !== null) {
            // match[1] is double-quoted group, match[2] is single-quoted group
            if (match[1] !== undefined) {
                tokens.push(match[1]);
            } else if (match[2] !== undefined) {
                tokens.push(match[2]);
            } else {
                tokens.push(match[0]);
            }
        }

        return tokens;
    }
}
