"use client";

import { Terminal } from '@/components/shellfolio/terminal';
import Image from 'next/image';
import Grainient from '@/components/shellfolio/Grainient';
import Badge from '@/components/shellfolio/Badge';


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
      {/* Badge Container */}
      <div className="hidden md:block absolute top-0 left-[7%] w-[600px] -ml-[173px] h-screen z-20 pointer-events-none overflow-visible">
        <div className="w-full h-full pointer-events-auto">
          <Badge />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl h-[80vh] min-h-[500px] flex flex-col md:flex-row gap-8">
        <div className="hidden md:w-1/3 md:flex">
          {/* Spacer */}
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
