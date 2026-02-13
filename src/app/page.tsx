"use client";

import { Terminal } from '@/components/shellfolio/terminal';
import Grainient from '@/components/shellfolio/Grainient';
import Script from 'next/script';
import { BadgeThree } from '@/components/shellfolio/BadgeThree';
import { useState } from 'react';
// import Iridescence from '@/components/shellfolio/Iridescence';


export default function Home() {
  const [threeReady, setThreeReady] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center p-2 sm:p-8">
      <Script
        src="https://unpkg.com/three@0.179.1/build/three.min.js"
        strategy="afterInteractive"
        onLoad={() => setThreeReady(true)}
      />
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
          <BadgeThree threeReady={threeReady} />
        </div>
        <div className="w-full md:w-2/3 h-full">
          <Terminal />
        </div>
      </div>
    </main>
  );
}
