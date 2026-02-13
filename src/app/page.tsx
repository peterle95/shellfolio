"use client";

import { Terminal } from '@/components/shellfolio/terminal';
import Image from 'next/image';
import Grainient from '@/components/shellfolio/Grainient';
// import Iridescence from '@/components/shellfolio/Iridescence';


export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-2 sm:p-8">
      {/* Animated Grainient background */}
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B19EEF"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
        {/* <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact
          amplitude={0.1}
          speed={1}
        /> */}
      </div>
      <div className="relative z-10 w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col md:flex-row gap-8">
        <div className="hidden md:w-1/3 md:flex items-center justify-center">
          <div className="relative group w-[300px] h-[430px] animate-float [perspective:1200px]">

            {/* Lanyard Strap */}
            <div className="absolute top-[-110px] left-1/2 -translate-x-1/2 w-10 h-[116px] rounded-b-lg bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-700 shadow-[0_10px_16px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/15" />
            </div>

            {/* Swivel Clasp */}
            <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="h-6 w-6 rounded-full border border-slate-400/70 bg-gradient-to-br from-slate-200 via-slate-500 to-slate-700 shadow-md" />
              <div className="h-4 w-[3px] rounded-full bg-gradient-to-b from-slate-200 to-slate-700" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-md border border-slate-400/70 bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 shadow-lg">
                <div className="h-7 w-7 rounded-sm border border-slate-300/60 bg-transparent" />
              </div>
            </div>

            {/* Hook */}
            <div className="absolute top-[14px] left-1/2 h-7 w-5 -translate-x-1/2 rounded-b-full border border-slate-400/70 bg-gradient-to-b from-slate-200 to-slate-800 clip-path-hook" />


            {/* The Badge */}
            <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-gradient-to-b from-zinc-100/95 to-zinc-300/95 p-3 shadow-[0_26px_40px_rgba(0,0,0,0.32)] ring-1 ring-black/10 transition-transform duration-300 group-hover:rotate-y-[-8deg] group-hover:rotate-x-[4deg]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/55 via-transparent to-black/15 pointer-events-none" />
              <div className="absolute top-5 left-1/2 z-20 h-2.5 w-10 -translate-x-1/2 rounded-full border border-zinc-500/50 bg-zinc-200/70 shadow-inner" />
              <Image
                src="/images/batch.jpeg"
                alt="Photo of Peter Mölzer"
                fill
                className="rounded-xl object-cover [clip-path:inset(20px_12px_36px_12px_round_16px)]"
              />
              <div className="absolute inset-x-6 bottom-4 z-20 rounded-md border border-zinc-300/80 bg-zinc-50/70 px-3 py-2 text-center font-mono text-xs tracking-widest text-zinc-700 shadow-sm backdrop-blur-sm">
                SHELLFOLIO · ACCESS
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
