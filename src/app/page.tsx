import { Terminal } from '@/components/shellfolio/terminal';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl h-[80vh] min-h-[500px]">
        <Terminal />
      </div>
    </main>
  );
}
