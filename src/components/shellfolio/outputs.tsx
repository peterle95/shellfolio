import React from 'react';
import { commandList } from './commands';
import {
    aboutParagraphs,
    portfolioProjects,
    educationHistory,
    workExperience,
    credentialItems,
    contactLinks,
    cvPdfPublicPath,
} from '@/lib/portfolio-data';

export const Welcome = () => (
    <div>
        <h1 className="text-2xl font-bold text-primary mb-4">Welcome to Peter Mölzer's Shellfolio!</h1>
        <p>This is my interactive portfolio.</p>
        <p className="mt-2">Type <span className="font-bold text-primary">'help'</span> to see a list of available commands.</p>
    </div>
);

export const Help = () => (
    <div>
        <p className="mb-2">Here are the available commands:</p>
        <ul className="space-y-1">
            {commandList.map(({ cmd, desc }) => (
                <li key={cmd} className="flex items-start">
                    <span className="text-primary font-bold w-32 inline-block shrink-0">{cmd.trim()}</span>
                    <span className="flex-1">- {desc}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const About = () => (
    <div>
        {aboutParagraphs.map((p, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : undefined}>
                {p}
            </p>
        ))}
    </div>
);

export const Projects = () => (
    <div>
        {portfolioProjects.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
                <h3 className="text-lg font-bold text-primary">{project.title}</h3>
                <p className="mt-1">{project.description}</p>
                <p className="mt-2 text-sm">
                    <span className="font-bold">Stack:</span> {project.stack}
                </p>
                <div className="flex gap-4 mt-2">
                    {project.live &&
                        project.live !== '#' &&
                        project.title !== 'cub3d' &&
                        project.title !== 'Minishell' && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Live Demo
                            </a>
                        )}
                    <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        GitHub Repo
                    </a>
                </div>
            </div>
        ))}
    </div>
);

export const Education = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Education</h3>
        {educationHistory.map((e, i) => (
            <div key={i} className="mb-4 last:mb-0">
                <p className="font-bold">{e.institution}</p>
                <p>{e.program}</p>
                <p className="text-sm text-muted-foreground">{e.period}</p>
            </div>
        ))}
    </div>
);

export const WorkExperience = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Work Experience</h3>
        {workExperience.map((job, i) => (
            <div key={i} className="mb-4 last:mb-0">
                <p className="font-bold">{job.company}</p>
                <p>{job.role}</p>
                <p className="text-sm text-muted-foreground">{job.period}</p>
            </div>
        ))}
    </div>
);

export const Credentials = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Credentials and Certifications</h3>
        <div className="pl-4">
            {credentialItems.map((c) => (
                <div key={c.href} className="mb-4 last:mb-0">
                    <p className="font-bold">{c.issuer}</p>
                    <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 inline-block"
                    >
                        {c.title}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">{c.year}</p>
                </div>
            ))}
        </div>
    </div>
);

export const Cv = () => (
    <div>
        <p>You can view or download my cv by clicking the link below.</p>
        <a
            href={cvPdfPublicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline mt-2 inline-block"
        >
            Download cv (PDF)
        </a>
    </div>
);

/** @deprecated Prefer {@link Cv} */
export const cv = Cv;

export const Contact = () => (
    <div>
        <p>Feel free to reach out. I'm always open to connecting!</p>
        <ul className="mt-2 space-y-1">
            <li>
                <span className="font-bold w-24 inline-block">Email:</span>{' '}
                <a href={`mailto:${contactLinks.email}`} className="text-primary hover:underline">
                    {contactLinks.email}
                </a>
            </li>
            <li>
                <span className="font-bold w-24 inline-block">LinkedIn:</span>{' '}
                <a
                    href={contactLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    linkedin.com/in/peter-moelzer
                </a>
            </li>
            <li>
                <span className="font-bold w-24 inline-block">GitHub:</span>{' '}
                <a
                    href={contactLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    github.com/peterle95
                </a>
            </li>
        </ul>
    </div>
);

export const NotFound = ({ command }: { command?: string }) => (
    <div>
        <p>
            Command not found: <span className="text-destructive">{command}</span>
        </p>
        <p>
            Type <span className="font-bold text-primary">'help'</span> for a list of available commands.
        </p>
    </div>
);
