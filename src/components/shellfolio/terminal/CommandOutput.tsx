import React, { ReactNode } from 'react';

export const OutputHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: 'var(--terminal-prompt-user)' }}>
        {children}
    </h2>
);

export const OutputSubheading = ({ children }: { children: ReactNode }) => (
    <h3 className="text-lg font-semibold mt-3 mb-1 opacity-90">
        {children}
    </h3>
);

export const OutputDivider = () => (
    <div className="w-full h-[1px] my-3 opacity-20" style={{ backgroundColor: 'var(--terminal-border)' }} />
);

export const OutputText = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <p className={`mb-2 leading-relaxed opacity-90 ${className}`}>
        {children}
    </p>
);

export const OutputCode = ({ children }: { children: ReactNode }) => (
    <pre className="p-3 my-2 rounded text-sm overflow-x-auto" style={{ backgroundColor: 'var(--terminal-header)' }}>
        <code>{children}</code>
    </pre>
);

export const OutputLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="underline underline-offset-4 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--terminal-link)' }}
    >
        {children}
    </a>
);

export const OutputError = ({ children }: { children: ReactNode }) => (
    <div className="flex items-start gap-2 my-2 py-2 px-3 rounded border-l-2" style={{ borderColor: 'var(--terminal-error)', backgroundColor: 'var(--terminal-error)20' }}>
        <span style={{ color: 'var(--terminal-error)' }}>✖</span>
        <span className="opacity-90">{children}</span>
    </div>
);

export const OutputWarning = ({ children }: { children: ReactNode }) => (
    <div className="flex items-start gap-2 my-2 py-2 px-3 rounded border-l-2" style={{ borderColor: 'var(--terminal-warning)', backgroundColor: 'var(--terminal-warning)20' }}>
        <span style={{ color: 'var(--terminal-warning)' }}>⚠</span>
        <span className="opacity-90">{children}</span>
    </div>
);

export const OutputSuccess = ({ children }: { children: ReactNode }) => (
    <div className="flex items-start gap-2 my-2 py-2 px-3 rounded border-l-2" style={{ borderColor: 'var(--terminal-success)', backgroundColor: 'var(--terminal-success)20' }}>
        <span style={{ color: 'var(--terminal-success)' }}>✔</span>
        <span className="opacity-90">{children}</span>
    </div>
);
