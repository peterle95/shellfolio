import { Terminal } from '@/components/shellfolio/terminal';
import { VisualEffects } from '@/components/shellfolio/VisualEffects';

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-2 sm:p-8">
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
    </main>
  );
}
