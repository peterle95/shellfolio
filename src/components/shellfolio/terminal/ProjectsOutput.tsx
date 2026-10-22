"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import type { PortfolioProject, ProjectImage } from '@/lib/portfolio-data';
import styles from './ProjectsOutput.module.css';

function ProjectPreview({ image }: { image: ProjectImage }) {
    const [failed, setFailed] = useState(false);

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
            </div>
            {image.caption && <figcaption className={styles.caption}>{image.caption}</figcaption>}
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
                            {project.image && <ProjectPreview image={project.image} />}
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    );
}
