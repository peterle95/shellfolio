"use client";

import { useEffect, useRef, useState } from 'react';
import Lanyard from './Lanyard';

interface BadgeProps {
    onReady: () => void
    onFailure: () => void
}

/** Horizontal centre of the layout's empty badge column, as a fraction of the full-screen host. */
function useSlotAnchor(hostRef: React.RefObject<HTMLDivElement | null>) {
    const [anchor, setAnchor] = useState(0.27);

    useEffect(() => {
        const host = hostRef.current;
        const slot = document.querySelector<HTMLElement>('[data-badge-slot]');
        if (!host || !slot) return;
        const measure = () => {
            const hostRect = host.getBoundingClientRect();
            const slotRect = slot.getBoundingClientRect();
            if (hostRect.width <= 0 || slotRect.width <= 0) return;
            setAnchor((slotRect.left + slotRect.width / 2 - hostRect.left) / hostRect.width);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(host);
        observer.observe(slot);
        return () => observer.disconnect();
    }, [hostRef]);

    return anchor;
}

export default function Badge({ onReady, onFailure }: BadgeProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const anchor = useSlotAnchor(hostRef);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        let canvas: HTMLCanvasElement | null = null;
        const onLost = () => onFailure();
        // Lanyard mounts its WebGL canvas synchronously in its effect, or silently skips it when
        // WebGL is unavailable. Give it two frames (and the card images a moment) before revealing.
        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                canvas = host.querySelector('canvas');
                if (!canvas) { onFailure(); return; }
                canvas.addEventListener('webglcontextlost', onLost);
                onReady();
            });
        });
        return () => {
            cancelAnimationFrame(frame);
            canvas?.removeEventListener('webglcontextlost', onLost);
        };
    }, [onReady, onFailure]);

    return (
        <div ref={hostRef} className="h-full w-full">
            <Lanyard
                frontImage="/images/badge-portrait.webp"
                imageFit="cover"
                cardColor="#f4f4f4"
                strapColor="#111111"
                metal="gold"
                size={0.42}
                cornerRadius={0.2}
                anchor={anchor}
                passThrough
                strapLength={0.55}
                strapWidth={0.75}
                gravity={1.35}
                damping={0.2}
                elasticity={0.6}
                breeze={0.8}
            />
        </div>
    );
}
