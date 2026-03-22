import { CommandContext } from './types';
import { CommandRegistry } from './command-registry';

export class AutocompleteEngine {
    private registry: CommandRegistry;

    constructor(registry: CommandRegistry) {
        this.registry = registry;
    }

    public complete(partial: string, ctx: CommandContext): string[] {
        if (!partial) {
            return [];
        }

        const parts = partial.trimStart().split(/\s+/);

        // If typing the first word (command name)
        if (parts.length === 1 && !partial.endsWith(' ')) {
            return this.registry.autocomplete(parts[0], ctx);
        }

        // If typing arguments, delegate to the command's custom autocomplete if it exists
        const commandName = parts[0];
        const command = this.registry.get(commandName);
        
        if (command && command.autocomplete) {
            return command.autocomplete(partial, ctx);
        }

        // Default to file path completion if the command typically takes paths
        // e.g. cd, cat, ls, open
        if (['cd', 'ls', 'cat', 'open'].includes(commandName)) {
            const currentArg = partial.endsWith(' ') ? '' : parts[parts.length - 1];
            return this.completePath(currentArg, ctx.cwd, ctx.vfs);
        }

        return [];
    }

    /**
     * Completes file and directory paths in the virtual filesystem.
     */
    public completePath(partialPath: string, cwd: string, vfs: any): string[] {
        // Find the base directory to search in
        let searchDir = cwd;
        let prefix = partialPath;

        if (partialPath.includes('/')) {
            const lastSlashIndex = partialPath.lastIndexOf('/');
            const dirPart = partialPath.substring(0, lastSlashIndex);
            
            if (dirPart === '') {
                searchDir = '/';
            } else {
                searchDir = vfs.resolve(dirPart, cwd);
            }
            prefix = partialPath.substring(lastSlashIndex + 1);
        }

        // Get directory contents
        const node = vfs.get(searchDir);
        if (!node || node.type !== 'directory') {
            return [];
        }

        const entries = Object.keys(node.children);
        const matches = entries.filter(e => e.startsWith(prefix));

        return matches.map(match => {
            const isDir = node.children[match].type === 'directory';
            const suffix = isDir ? '/' : '';
            
            // Reconstruct the full completed string based on the input partial path
            if (partialPath.includes('/')) {
                const lastSlashIndex = partialPath.lastIndexOf('/');
                return partialPath.substring(0, lastSlashIndex + 1) + match + suffix;
            }
            return match + suffix;
        });
    }
}
