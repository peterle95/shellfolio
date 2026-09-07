"use client";

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useState, type ReactNode } from 'react';

const Grainient = dynamic(() => import('./Grainient'), {
    ssr: false,
    loading: () => null,
});

const Badge = dynamic(() => import('./Badge'), {
    ssr: false,
    loading: () => null,
});

function useBadgeEnhancement(showBadge: boolean) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!showBadge) { setEnabled(false); return; }
        const media = window.matchMedia('(min-width: 1400px)');
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
        let pending: number | undefined;
        const idle = typeof window.requestIdleCallback === 'function';
        const eligible = () => media.matches && !motion.matches && !connection?.saveData;
        const cancel = () => {
            if (pending !== undefined) {
                if (idle) window.cancelIdleCallback(pending);
                else window.clearTimeout(pending);
                pending = undefined;
            }
        };
        const update = () => {
            cancel();
            if (!eligible()) setEnabled(false);
            if (!eligible() || document.hidden || document.readyState !== 'complete') return;
            const enhance = () => {
                pending = undefined;
                if (eligible() && !document.hidden) setEnabled(true);
            };
            pending = idle ? window.requestIdleCallback(enhance) : window.setTimeout(enhance, 200);
        };

        update();
        media.addEventListener('change', update);
        motion.addEventListener('change', update);
        connection?.addEventListener('change', update);
        window.addEventListener('load', update);
        document.addEventListener('visibilitychange', update);
        return () => {
            cancel();
            media.removeEventListener('change', update);
            motion.removeEventListener('change', update);
            connection?.removeEventListener('change', update);
            window.removeEventListener('load', update);
            document.removeEventListener('visibilitychange', update);
        };
    }, [showBadge]);

    return showBadge && enabled;
}

class BadgeBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch() { this.props.onFailure(); }
    render() { return this.state.failed ? null : this.props.children; }
}

export function VisualEffects({ showBadge = true }: { showBadge?: boolean }) {
    const enhanceBadge = useBadgeEnhancement(showBadge);
    const [badgeReady, setBadgeReady] = useState(false);
    const [badgeFailed, setBadgeFailed] = useState(false);
    const onReady = useCallback(() => setBadgeReady(true), []);
    const onFailure = useCallback(() => { setBadgeFailed(true); setBadgeReady(false); }, []);
    useEffect(() => { if (!enhanceBadge) setBadgeReady(false); }, [enhanceBadge]);
    const visibleBadge = enhanceBadge && badgeReady && !badgeFailed;

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
                <div aria-hidden="true" data-badge-ready={visibleBadge} className="hidden min-[1400px]:block fixed inset-0 z-20 pointer-events-none">
                    <div className={`absolute left-[29.56vh] top-0 aspect-[250/706] w-[27.83vh] transition-opacity duration-300 motion-reduce:transition-none ${visibleBadge ? 'opacity-0' : 'opacity-100'}`}>
                        <picture>
                            <source media="(min-width: 1400px)" srcSet="/images/badge-static.webp" />
                            <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width={501} height={1411} fetchPriority="high" className="h-full w-full" />
                        </picture>
                    </div>
                    <div className={`w-full h-full transition-opacity duration-300 motion-reduce:transition-none ${visibleBadge ? 'opacity-100' : 'opacity-0'}`}>
                        {enhanceBadge && !badgeFailed && (
                            <BadgeBoundary onFailure={onFailure}>
                                <Badge onReady={onReady} onFailure={onFailure} />
                            </BadgeBoundary>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
