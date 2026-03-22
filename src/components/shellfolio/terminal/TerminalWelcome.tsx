import React from 'react';

export const TerminalWelcome = () => {
    return (
        <div className="mb-6 animate-in fade-in duration-700">
            <pre className="text-xs sm:text-sm font-bold mb-4 opacity-90" style={{ color: 'var(--terminal-prompt-user)' }}>
{`
 ___ _        _ _  __     _ _       
/ __| |_  ___| | |/ _|___| (_)___   
\\__ \\ ' \\/ -_) | |  _/ _ \\ | / _ \\  
|___/_||_\\___|_|_|_| \\___/_|_\\___/  
`}
            </pre>
            <div className="space-y-2 opacity-90">
                <p>Welcome to <strong style={{ color: 'var(--terminal-prompt-user)' }}>Shellfolio OS v1.0.0</strong>.</p>
                <p>Type <strong style={{ color: 'var(--terminal-prompt-path)' }}>'help'</strong> to see a list of available commands, or explore the filesystem.</p>
                <p className="text-sm opacity-60 mt-4 mb-2">System booted successfully. All services running.</p>
            </div>
        </div>
    );
};
