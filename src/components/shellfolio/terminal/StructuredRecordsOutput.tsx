import React from 'react';
import type { StringRecord } from '@/lib/portfolio-data';
import { OutputLink } from './CommandOutput';

function hrefFor(key: string, value: string): string {
    if (key === 'email' && value.includes('@')) return `mailto:${value}`;
    return value;
}

function shouldRenderLink(key: string, value: string): boolean {
    if (!value || value === '#') return false;
    if (/^https?:\/\//i.test(value)) return true;
    if (value.startsWith('mailto:')) return true;
    if (value.startsWith('/') && /[./]/.test(value)) return true;
    if (key === 'email' && value.includes('@')) return true;
    return false;
}

function JsonValue({ keyName, value }: { keyName: string; value: string }) {
    if (shouldRenderLink(keyName, value)) {
        return (
            <>
                <span className="opacity-50">&quot;</span>
                <OutputLink href={hrefFor(keyName, value)}>{value}</OutputLink>
                <span className="opacity-50">&quot;</span>
            </>
        );
    }
    return <span style={{ color: 'var(--terminal-fg)' }}>{JSON.stringify(value)}</span>;
}

/**
 * Renders `records` like a pretty-printed JSON array of objects (see work experience format).
 * URL-like values (http(s), site paths, mailto) are real links.
 */
export function StructuredRecordsOutput({
    records,
    className = '',
}: {
    records: StringRecord[];
    className?: string;
}) {
    return (
        <pre
            className={`p-3 my-1 rounded text-sm overflow-x-auto leading-relaxed whitespace-pre-wrap font-mono ${className}`}
            style={{ backgroundColor: 'var(--terminal-header)' }}
        >
            <span className="opacity-60">[</span>
            {records.map((record, ri) => {
                const entries = Object.entries(record);
                return (
                    <span key={ri}>
                        {ri > 0 ? <span className="opacity-60">,</span> : null}
                        {'\n  '}
                        <span className="opacity-60">{'{'}</span>
                        {'\n'}
                        {entries.map(([k, v], ki) => (
                            <span key={k}>
                                {'    '}
                                <span style={{ color: 'var(--terminal-prompt-path)' }}>&quot;{k}&quot;</span>
                                <span className="opacity-60">: </span>
                                <JsonValue keyName={k} value={v} />
                                {ki < entries.length - 1 ? <span className="opacity-60">,</span> : null}
                                {'\n'}
                            </span>
                        ))}
                        {'  '}
                        <span className="opacity-60">{'}'}</span>
                        {'\n'}
                    </span>
                );
            })}
            <span className="opacity-60">]</span>
        </pre>
    );
}
