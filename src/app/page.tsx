import Link from 'next/link';
import { Terminal } from '@/components/shellfolio/terminal';
import { VisualEffects } from '@/components/shellfolio/VisualEffects';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-2 sm:p-8">
      <div aria-hidden="true" className="fixed inset-0 z-0 shellfolio-visual-fallback" />
      <VisualEffects />

      <div className="relative z-10 w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col min-[1400px]:flex-row gap-0 min-[1400px]:gap-8">
        <div className="hidden min-[1400px]:flex min-[1400px]:w-1/3 shrink-0">
          {/* Spacer */}
        </div>
        <div className="w-full min-[1400px]:flex-1 h-full min-w-0">
          <Terminal />
        </div>
      </div>

      <section aria-label="LifeBot Personal" className="relative z-10 mt-6 w-full max-w-7xl rounded border border-white/10 bg-black/60 px-4 py-4 font-mono text-sm leading-6 text-white/80">
        <h2 className="text-base font-bold text-white">LifeBot Personal</h2>
        <p className="mt-1">
          LifeBot Personal is a personal life-adviser bot that reads your Google Calendar events
          read-only for daily briefings, checks your assigned Trello cards, and prepares habit and
          health reviews. It is a single-user app whose data stays on your own server.{' '}
          <Link className="text-fuchsia-300 underline" href="/privacy" prefetch={false}>Privacy Policy</Link>
        </p>
      </section>
    </main>
  );
}
