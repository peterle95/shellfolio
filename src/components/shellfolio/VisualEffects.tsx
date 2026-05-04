"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Grainient = dynamic(() => import('./Grainient'), {
    ssr: false,
    loading: () => null,
});

const Badge = dynamic(() => import('./Badge'), {
    ssr: false,
    loading: () => null,
});

function useLargeViewport() {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1400px)');
        const update = () => setMatches(media.matches);

        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    return matches;
}

export function VisualEffects() {
    const showBadge = useLargeViewport();

    return (
        <>
            <div aria-hidden="true" className="fixed inset-0 z-0">
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
            </div>
            {showBadge && (
                <div aria-hidden="true" className="fixed inset-0 z-20 pointer-events-none">
                    <div className="w-full h-full">
                        <Badge />
                    </div>
                </div>
            )}
        </>
    );
}
