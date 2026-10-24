import { Terminal } from '@/components/shellfolio/terminal';
import { PortfolioLayout } from '@/components/shellfolio/PortfolioLayout';
import { TerminalProvider } from '@/lib/terminal/terminal-state';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-2 sm:p-8">
      <div aria-hidden="true" className="fixed inset-0 z-0 shellfolio-visual-fallback" />
      <TerminalProvider>
        <PortfolioLayout>
          <Terminal />
        </PortfolioLayout>
      </TerminalProvider>

    </main>
  );
}
