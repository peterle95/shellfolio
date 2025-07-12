import React from 'react';
import { commandList } from './commands';

export const Welcome = () => (
    <div>
        <h1 className="text-2xl font-bold text-primary mb-4">Welcome to Peter Mölzer's Shellfolio!</h1>
        <p>This is my interactive portfolio. It looks and feels like a terminal.</p>
        <p className="mt-2">Type <span className="font-bold text-primary">'help'</span> to see a list of available commands.</p>
    </div>
);

export const Help = () => (
    <div>
        <p className="mb-2">Here are the available commands:</p>
        <ul className="space-y-1">
            {commandList.map(({ cmd, desc }) => (
                <li key={cmd} className="flex items-start">
                    <span className="text-primary font-bold w-28 inline-block shrink-0">{cmd.trim()}</span>
                    <span className="flex-1">- {desc}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const About = () => (
    <div>
        <p>I was born in Genoa (Italy) and since 2014 I live in Berlin. I have a bachelor of science degree from Humboldt Universität zu Berlin in the field of economics and currently finishing my further training in computer science at the 42 school.</p>
        <p className="mt-2">Economist transitioning into software engineering, driven by a fascination with how technology—particularly AI—can transform data into actionable insights. After analyzing markets and building partnerships (Klarna, Clark), I pursued computer science at 42 School to bridge business strategy with technical execution, build and create new software.</p>
        <p className="mt-2">I generally like to read books, write, play the guitar and dj.</p>
    </div>
);

const projectData = [
    {
        title: "Project Alpha",
        description: "A comprehensive e-commerce platform built with Next.js, TypeScript, and Stripe, featuring a fully-integrated CMS for product management and a seamless checkout experience.",
        stack: "Next.js, TypeScript, Stripe, Tailwind CSS",
        live: "#",
        repo: "#",
    },
    {
        title: "Project Beta",
        description: "An interactive data visualization dashboard that provides real-time analytics using D3.js and React. It's designed to handle large datasets with optimal performance.",
        stack: "React, D3.js, Node.js, WebSocket",
        live: "#",
        repo: "#",
    },
    {
        title: "Project Gamma",
        description: "A collaborative project management tool inspired by Trello, featuring drag-and-drop functionality, real-time updates via Firebase, and a clean, minimalist UI.",
        stack: "React, Firebase, Mantine UI",
        live: "#",
        repo: "#",
    }
];

export const Projects = () => (
    <div>
        {projectData.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
                <h3 className="text-lg font-bold text-primary">{project.title}</h3>
                <p className="mt-1">{project.description}</p>
                <p className="mt-2 text-sm"><span className="font-bold">Stack:</span> {project.stack}</p>
                <div className="flex gap-4 mt-2">
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Live Demo</a>
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Repo</a>
                </div>
            </div>
        ))}
    </div>
);

export const Education = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Education</h3>
        <div className="mb-4">
            <p className="font-bold">42 Berlin</p>
            <p>Computer Science & Software Engineering</p>
            <p className="text-sm text-muted-foreground">2022 - Present</p>
        </div>
        <div>
            <p className="font-bold">Humboldt-Universität zu Berlin</p>
            <p>Bachelor of Science, Economics</p>
            <p className="text-sm text-muted-foreground">2015 - 2019</p>
        </div>
    </div>
);

export const WorkExperience = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Work Experience</h3>
        <div className="mb-4">
            <div>
            <p className="font-bold">Klarna</p>
            <p>Development Manager</p>
            <p className="text-sm text-muted-foreground">2022 - 2023</p>
            </div>
            <p className="font-bold">Clark</p>
            <p>Partnerships Manager</p>
            <p className="text-sm text-muted-foreground">2021 - 2022</p>
        </div>
    </div>
);

export const Credentials = () => (
    <div>
        <h3 className="text-lg font-bold text-primary mb-2">Credentials and Certifications</h3>
        <div className="mb-4">
            <div>
            <p className="font-bold">Coursera</p>
                <a href="/files/Coursera.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mt-2 inline-block">
                    Meta Front-End Developer Specialization (PDF)
                </a>
            <p className="text-sm text-muted-foreground">2023</p>
            </div>
            <p className="font-bold">Leapsome</p>
                <a href="/files/Security_Basics.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mt-2 inline-block">
                    Security Basics (PDF)
                </a>
            <p className="text-sm text-muted-foreground">2021</p>
        </div>
    </div>
);

export const Resume = () => (
    <div>
        <p>You can view or download my resume by clicking the link below.</p>
        <a href="/files/CVen.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mt-2 inline-block">
            Download Resume (PDF)
        </a>
    </div>
);

export const Contact = () => (
    <div>
        <p>Feel free to reach out. I'm always open to connecting!</p>
        <ul className="mt-2 space-y-1">
            <li><span className="font-bold w-16 inline-block">Email:</span> <a href="mailto:moelzerpeter@gmail.com" className="text-primary hover:underline">moelzerpeter@gmail.com</a></li>
            <li><span className="font-bold w-16 inline-block">LinkedIn:  </span> <a href="https://www.linkedin.com/in/peter-moelzer/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com/in/peter-moelzer</a></li>
            <li><span className="font-bold w-16 inline-block">GitHub:</span> <a href="https://github.com/peterle95" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/peterle95</a></li>
        </ul>
    </div>
);

export const NotFound = ({ command }: { command?: string }) => (
    <div>
        <p>Command not found: <span className="text-destructive">{command}</span></p>
        <p>Type <span className="font-bold text-primary">'help'</span> for a list of available commands.</p>
    </div>
);
