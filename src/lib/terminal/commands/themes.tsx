import React from 'react';
import { Command } from '../types';
import { OutputHeading, OutputText } from '@/components/shellfolio/terminal/CommandOutput';

export const themesCommand: Command = {
    name: 'themes',
    description: 'List available themes',
    execute: (parsed, ctx) => {
        const available = ctx.themeManager.getAvailableThemes();
        
        return (
            <div>
                <OutputHeading>Available Themes</OutputHeading>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                    {available.map(theme => (
                        <span 
                            key={theme}
                            className={ctx.themeManager.current.name === theme ? 'font-bold' : ''}
                            style={{ color: ctx.themeManager.current.name === theme ? 'var(--terminal-prompt-path)' : 'inherit' }}
                        >
                            {theme}{ctx.themeManager.current.name === theme ? ' (current)' : ''}
                        </span>
                    ))}
                </div>
                <OutputText className="text-sm opacity-60 mt-4">
                    Type `theme &lt;name&gt;` to apply.
                </OutputText>
            </div>
        );
    }
};
