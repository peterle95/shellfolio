import { Terminal } from '@/components/shellfolio/terminal';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex items-center justify-center">
          <div className="relative w-[300px] h-[400px] group">
            <div className="absolute inset-0 bg-card rounded-xl transform-gpu transition-transform duration-500 group-hover:rotate-3"></div>
            <Image
              src="https://placehold.co/300x400.png"
              alt="Peter Mölzer"
              width={300}
              height={400}
              data-ai-hint="man portrait"
              className="relative rounded-xl shadow-2xl object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3 h-full">
          <Terminal />
        </div>
      </div>
    </main>
  );
}
