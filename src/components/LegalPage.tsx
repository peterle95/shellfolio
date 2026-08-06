import Link from 'next/link';
import { TerminalShellFrame } from '@/components/shellfolio/terminal/TerminalShellFrame';

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-2 sm:p-8">
      <div className="mx-auto h-[calc(100vh-1rem)] min-h-[600px] max-w-5xl sm:h-[calc(100vh-4rem)]">
        <TerminalShellFrame>
          <div className="h-full overflow-y-auto p-2 font-mono text-sm leading-6 sm:p-6">
            <div className="mb-6 text-fuchsia-300">peter@portfolio:~$ cat {title.toLowerCase().replaceAll(' ', '-')}</div>
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
