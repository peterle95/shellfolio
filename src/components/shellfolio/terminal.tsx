import React from 'react';
import { TerminalProvider } from '@/lib/terminal/terminal-state';
import { TerminalShellFrame } from './terminal/TerminalShellFrame';
import { TerminalInteractiveViewport } from './terminal/TerminalInteractiveViewport';
import { TerminalResetButton } from './terminal/TerminalResetButton';
import { TerminalWelcome } from './terminal/TerminalWelcome';
import { QuickActions } from './terminal/QuickActions';

export function Terminal() {
    return (
        <TerminalProvider>
            <TerminalShellFrame actions={<TerminalResetButton />}>
                <TerminalInteractiveViewport>
                    <TerminalWelcome />
                    <QuickActions />
                </TerminalInteractiveViewport>
            </TerminalShellFrame>
        </TerminalProvider>
    );
}
