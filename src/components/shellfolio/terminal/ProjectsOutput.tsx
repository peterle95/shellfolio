"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import type { PortfolioProject, ProjectImage, ProjectVideo } from '@/lib/portfolio-data';
import { useTerminal } from '@/lib/terminal/terminal-state';
import styles from './ProjectsOutput.module.css';

function ProjectVideoPlayer({ video, title, descriptionId }: { video: ProjectVideo; title: string; descriptionId: string }) {
    const playerRef = useRef<HTMLVideoElement>(null);
    const playbackId = useId();
    const { activeProjectVideo, playProjectVideo } = useTerminal();
    const [failed, setFailed] = useState(false);
    const active = activeProjectVideo === playbackId && !failed;

    useEffect(() => {
        if (!active) return;
        const player = playerRef.current;
        player?.focus({ preventScroll: true });
        return () => {
            if (!player) return;
            player.pause();
            player.removeAttribute('src');
            player.load(); // Release the decoder and abort any remaining download.
            if (document.fullscreenElement === player) void document.exitFullscreen().catch(() => {});
        };
    }, [active]);

    function play() {
        const player = playerRef.current;
        if (!player) return;
        setFailed(false);
        playProjectVideo(playbackId);
        // Attach the source only in this explicit user gesture, never during render.
        player.src = video.src;
        void player.play().catch(error => {
            // A browser may require another gesture on its native controls.
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError' && player.hasAttribute('src')) setFailed(true);
        });
    }

    return (
        <>
            <video ref={playerRef} className={styles.player} hidden={!active}
                controls playsInline preload="none" aria-label={`Shared placeholder video for ${title}`}
                aria-describedby={descriptionId} onError={event => {
                    if (event.currentTarget.hasAttribute('src')) setFailed(true);
                }} />
            {failed && <p role="status" className={`${styles.unavailable} ${styles.videoError}`}>Video unavailable. Project details and links are still available.</p>}
            {!active && !failed && <button type="button" onClick={play} className={styles.play}
                aria-label={`Play shared placeholder video for ${title}`}>
                <svg aria-hidden="true" focusable="false" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m9 5 11 7-11 7z" />
                </svg>
            </button>}
        </>
    );
}

function ProjectPreview({ image, video, title }: { image: ProjectImage; video?: ProjectVideo; title: string }) {
    const [failed, setFailed] = useState(false);
    const descriptionId = useId();

    return (
        <figure className={styles.preview}>
            <div className={styles.imageFrame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                {failed ? (
                    <p className={styles.unavailable}>Preview unavailable. Project details and links are still available.</p>
                ) : (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(min-width: 1400px) 600px, (min-width: 960px) calc(50vw - 80px), (min-width: 640px) calc(100vw - 130px), calc(100vw - 70px)"
                        loading="lazy"
                        onError={() => setFailed(true)}
                        className={styles.image}
                    />
                )}
                {video && <ProjectVideoPlayer video={video} title={title} descriptionId={descriptionId} />}
            </div>
            {image.caption && <figcaption className={styles.caption}>{image.caption}</figcaption>}
            {video && <p id={descriptionId} className={styles.caption}>{video.description}</p>}
        </figure>
    );
}

export function ProjectsOutput({ projects }: { projects: PortfolioProject[] }) {
    return (
        <section aria-label="Projects" className={styles.projects}>
            <ol className={styles.list}>
                {projects.map(project => (
                    <li key={project.title}>
                        <article className={`${styles.card} ${project.image ? styles.withMedia : ''}`}>
                            <div className={styles.copy}>
                                <h2 className={styles.title}>{project.title}</h2>
                                <p className={styles.shortDescription}>{project.shortDescription}</p>
                                <p className={styles.fullDescription}>{project.description}</p>
                                <p className={styles.stack}><strong>Stack:</strong> {project.stack}</p>
                                <nav aria-label={`Links for ${project.title}`} className={styles.links}>
                                    {([['Repository', project.repo], ['Live site', project.live]] as const).map(([label, href]) => (
                                        href && /^https?:\/\//i.test(href) ? (
                                            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                                aria-label={`${label} for ${project.title}`} className={styles.link}>
                                                {label}<span aria-hidden="true"> ↗</span>
                                            </a>
                                        ) : null
                                    ))}
                                </nav>
                            </div>
                            {project.image && <ProjectPreview image={project.image} video={project.video} title={project.title} />}
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    );
}
