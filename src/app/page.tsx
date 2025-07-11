"use client";

import { Terminal } from '@/components/shellfolio/terminal';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col md:flex-row gap-8">
        <div className="hidden md:w-1/3 md:flex items-center justify-center">
          <div className="relative group w-[300px] h-[400px] animate-float">

            {/* Lanyard Strap */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-8 h-[100px] bg-black"></div>

            {/* Swivel Clasp */}
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-500 bg-gray-700"></div>
              <div className="w-1 h-3 bg-gray-700"></div>
              <div className="w-8 h-8 rounded-md border-2 border-gray-500 bg-gray-700 flex items-center justify-center relative">
                <div className="w-4 h-full border-l-2 border-gray-500 absolute left-1"></div>
              </div>
            </div>
            
            {/* Hook */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-4 h-6 bg-gray-800 rounded-b-full border-2 border-gray-600 clip-path-hook"></div>


            {/* The Badge */}
            <div className="relative w-full h-full bg-card/30 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border-2 border-white/10">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-transparent border-2 border-gray-500 rounded-full"></div>
              <div className="p-2 h-full">
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
        </div>
        <div className="w-full md:w-2/3 h-full">
          <Terminal />
        </div>
      </div>
      <style jsx>{`
        .clip-path-hook {
          clip-path: path('M5,0 A5,5 0 0 1 15,0 L15,15 A5,5 0 0 1 5,15 Z M7,2 L7,13 A3,3 0 0 0 13,13 L13,2 A3,3 0 0 0 7,2 Z');
          transform-origin: top center;
          transform: translateX(-50%) scale(0.6);
        }
      `}</style>
    </main>
  );
}
