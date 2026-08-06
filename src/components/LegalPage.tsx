import Link from 'next/link';
import type { CSSProperties } from 'react';
import { TerminalShellFrame } from '@/components/shellfolio/terminal/TerminalShellFrame';
import { VisualEffects } from '@/components/shellfolio/VisualEffects';

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen p-2 sm:p-8">
      <div aria-hidden="true" className="fixed inset-0 z-0 shellfolio-visual-fallback" />
      <VisualEffects showBadge={false} />
      <div
        className="relative z-10 mx-auto h-[calc(100vh-1rem)] min-h-[600px] max-w-5xl sm:h-[calc(100vh-4rem)]"
        style={{ '--terminal-bg': 'hsl(220 13% 18% / 0.72)', '--terminal-header': 'hsl(220 15% 12% / 0.8)' } as CSSProperties}
      >
        <TerminalShellFrame closeHref="/">
          <div className="h-full overflow-y-auto p-2 font-mono text-sm leading-6 sm:p-6">
            <div className="mb-6 text-fuchsia-300">moelzerpeter@shellfolio:~$ cat {title.toLowerCase().replaceAll(' ', '-')}</div>
            <article className="max-w-3xl space-y-5 text-white/90">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {children}
              <Link className="text-fuchsia-300 underline" href="/">$ cd /home</Link>
            </article>
          </div>
        </TerminalShellFrame>
      </div>
    </main>
  );
}
