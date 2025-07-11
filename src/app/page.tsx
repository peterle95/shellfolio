import { Terminal } from '@/components/shellfolio/terminal';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex items-center justify-center">
          <div className="relative group w-[300px] h-[400px] animate-float">
            {/* Lanyard Clip */}
            <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-20 h-8 bg-secondary rounded-t-md border-b-4 border-b-muted flex items-center justify-center">
              <div className="w-10 h-2 bg-border rounded-full"></div>
            </div>
            {/* Lanyard Strap */}
            <div className="absolute top-[-84px] left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-primary rounded-t-full opacity-50"></div>

            {/* The Badge */}
            <div className="relative w-full h-full bg-card rounded-xl shadow-2xl overflow-hidden p-2 border-4 border-card">
              <Image
                src="https://placehold.co/300x400.png"
                alt="Peter Mölzer"
                width={300}
                height={400}
                data-ai-hint="man portrait"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="md:w-2/3 h-full">
          <Terminal />
        </div>
      </div>
    </main>
  );
}
