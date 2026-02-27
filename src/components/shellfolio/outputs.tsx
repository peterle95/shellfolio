import React from 'react';
import { commandList } from './commands';

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
        <p>I was born in Genoa (Italy) and since 2014 I live in Berlin. I have a bachelor of science degree from Humboldt Universität zu Berlin in the field of economics and currently finishing my further training in computer science at the 42 school.</p>
        <p className="mt-2">Economist transitioning into software engineering, driven by a fascination with how technology, particularly AI, can transform data into actionable insights. After analyzing markets and building partnerships (Klarna, Clark), I pursued computer science at 42 School to bridge business strategy with technical execution, build and create new software.</p>
        <p className="mt-2">I generally like to read books, write, play the guitar and dj.</p>
    </div>
);

const projectData = [
    
    {
        title: "Transcendence",
        description: "A green platform for connecting Users and Business for increasing urban sustainability. (Currently in development)",
        stack: "React, React Native, Tailwind CSS, Next.js",
        live: "#",
        repo: "https://github.com/peterle95/transcendence",
    },
    {
        title: "Webserv",
        description: "Custom HTTP server implemented in C++98. This project aims to provide a deep understanding of how HTTP servers operate, focusing on core network aspects and non-blocking behavior to handle multiple concurrent connections efficiently. The server's primary function is to receive HTTP requests from clients, process these requests, and send appropriate HTTP responses back.",
        stack: "C++98, Unix, Nginx, JavaScript, HTML, CSS, Python",
        live: "#",
        repo: "https://github.com/peterle95/webserv",
    },
    {
        title: "Shellfolio",
        description: "A collaborative project management tool inspired by Trello, featuring drag-and-drop functionality, real-time updates via Firebase, and a clean, minimalist UI.",
        stack: "TypeScript, React, Next.js",
        live: "https://petermoelzer-shellfolio.vercel.app/",
        repo: "https://github.com/peterle95/shellfolio",
    },
    {
        title: "cub3d",
        description: "A simple 3D raycasting engine inspired by Wolfenstein 3D, built using the miniLibX graphics library.",
        stack: "C, miniLibX",
        live: "#",
        repo: "https://github.com/peterle95/cub3d",
    },
    {
        title: "Minishell",
        description: "A lightweight Unix shell implementation that supports basic command execution, piping, and redirection. Designed for educational purposes to deepen understanding of shell internals and process management.",
        stack: "C, Unix, Shell Scripting",
        repo: "https://github.com/peterle95/minishell",
    },
    {
        title: "More Projects",
        description: "Check out my GitHub for more projects and contributions.",
        stack: "C, C++, JavaScript, TypeScript, React, ...",
        repo: "https://github.com/peterle95/"
    },
];

export const Projects = () => (
    <div>
        {projectData.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
                <h3 className="text-lg font-bold text-primary">{project.title}</h3>
                <p className="mt-1">{project.description}</p>
                <p className="mt-2 text-sm"><span className="font-bold">Stack:</span> {project.stack}</p>
                <div className="flex gap-4 mt-2">
                    {project.live && project.live !== "#" && project.title !== "cub3d" && project.title !== "Minishell" && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Live Demo</a>
                    )}
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
            <p className="font-bold">InnoBee</p>
            <p>Fullstack Developer</p>
            <p className="text-sm text-muted-foreground">2025 - Present</p>
            </div>
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
        <div className="pl-4">
            <div className="mb-4">
                <p className="font-bold">freeCodeCamp</p>
                <a href="/files/Coursera.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">
                    Legacy Full Stack Certification (PDF)
                </a>
                <p className="text-sm text-muted-foreground mt-1">2025</p>
            </div>
            <div className="mb-4">
                <p className="font-bold">Coursera</p>
                <a href="/files/Coursera.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">
                    Meta Front-End Developer Specialization (PDF)
                </a>
                <p className="text-sm text-muted-foreground mt-1">2023</p>
            </div>
            <div>
                <p className="font-bold">Leapsome</p>
                <a href="/files/Security_Basics.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">
                    Security Basics (PDF)
                </a>
                <p className="text-sm text-muted-foreground mt-1">2021</p>
            </div>
        </div>
    </div>
);

export const cv = () => (
    <div>
        <p>You can view or download my cv by clicking the link below.</p>
        <a href="/files/peter_moelzer_cv.pdf" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline mt-2 inline-block">
            Download cv (PDF)
        </a>
    </div>
);

export const Contact = () => (
    <div>
        <p>Feel free to reach out. I'm always open to connecting!</p>
        <ul className="mt-2 space-y-1">
            <li><span className="font-bold w-24 inline-block">Email:</span> <a href="mailto:moelzerpeter@gmail.com" className="text-primary hover:underline">moelzerpeter@gmail.com</a></li>
            <li><span className="font-bold w-24 inline-block">LinkedIn:</span> <a href="https://www.linkedin.com/in/peter-moelzer/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com/in/peter-moelzer</a></li>
            <li><span className="font-bold w-24 inline-block">GitHub:</span> <a href="https://github.com/peterle95" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/peterle95</a></li>
        </ul>
    </div>
);

export const NotFound = ({ command }: { command?: string }) => (
    <div>
        <p>Command not found: <span className="text-destructive">{command}</span></p>
        <p>Type <span className="font-bold text-primary">'help'</span> for a list of available commands.</p>
    </div>
);
