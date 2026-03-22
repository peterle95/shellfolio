/** Single source for portfolio copy — used by outputs.tsx and vfs-content.ts */

export const aboutParagraphs = [
    'I was born in Genoa (Italy) and since 2014 I live in Berlin. I have a bachelor of science degree from Humboldt Universität zu Berlin in the field of economics and currently finishing my further training in computer science at the 42 school.',
    'Economist transitioning into software engineering, driven by a fascination with how technology, particularly AI, can transform data into actionable insights. After analyzing markets and building partnerships (Klarna, Clark), I pursued computer science at 42 School to bridge business strategy with technical execution, build and create new software.',
    'I generally like to read books, write, play the guitar and dj.',
];

export const aboutBioPlainText = aboutParagraphs.join('\n\n');

export type PortfolioProject = {
    title: string;
    description: string;
    stack: string;
    live?: string;
    repo: string;
};

export const portfolioProjects: PortfolioProject[] = [
    {
        title: 'Transcendence',
        description:
            'Final project of 42 Core Curriculum. Together we 4 other fellow 42oers we created a platform for multiple games showcasing different technologies and games. (Currently in development)',
        stack: ', Next.js, TypeScript, React, Prisma, Tailwind CSS',
        live: '#',
        repo: 'https://github.com/peterle95/transcendence',
    },
    {
        title: 'Webserv',
        description:
            "Custom HTTP server implemented in C++98. This project aims to provide a deep understanding of how HTTP servers operate, focusing on core network aspects and non-blocking behavior to handle multiple concurrent connections efficiently. The server's primary function is to receive HTTP requests from clients, process these requests, and send appropriate HTTP responses back.",
        stack: 'C++98, Unix, Nginx, JavaScript, HTML, CSS, Python',
        live: '#',
        repo: 'https://github.com/peterle95/webserv',
    },
    {
        title: 'Shellfolio',
        description:
            'Personal portfolio webpage simulating shell. It makes my projects and other information interactive and fun.',
        stack: 'TypeScript, React, Next.js',
        live: 'https://petermoelzer-shellfolio.vercel.app/',
        repo: 'https://github.com/peterle95/shellfolio',
    },
    {
        title: 'cub3d',
        description:
            'A simple 3D raycasting engine inspired by Wolfenstein 3D, built using the miniLibX graphics library.',
        stack: 'C, miniLibX',
        live: '#',
        repo: 'https://github.com/peterle95/cub3d',
    },
    {
        title: 'Minishell',
        description:
            'A lightweight Unix shell implementation that supports basic command execution, piping, and redirection. Designed for educational purposes to deepen understanding of shell internals and process management.',
        stack: 'C, Unix, Shell Scripting',
        repo: 'https://github.com/peterle95/minishell',
    },
    {
        title: 'More Projects',
        description: 'Check out my GitHub for more projects and contributions.',
        stack: 'C, C++, JavaScript, TypeScript, React, ...',
        repo: 'https://github.com/peterle95/',
    },
];

export const educationHistory = [
    {
        institution: '42 Berlin',
        program: 'Computer Science & Software Engineering',
        period: '2022 - Present',
    },
    {
        institution: 'Humboldt-Universität zu Berlin',
        program: 'Bachelor of Science, Economics',
        period: '2015 - 2019',
    },
];

export const workExperience = [
    { company: 'InnoBee', role: 'Fullstack Developer', period: '2025 - Present' },
    { company: 'Klarna', role: 'Development Manager', period: '2022 - 2023' },
    { company: 'Clark', role: 'Partnerships Manager', period: '2021 - 2022' },
];

export type CredentialItem = {
    issuer: string;
    title: string;
    href: string;
    year: string;
};

export const credentialItems: CredentialItem[] = [
    {
        issuer: 'Anthropic',
        title: 'Anthropic - AI Fluency: Framework & Foundations (PDF)',
        href: '/files/AI Anthropic.pdf',
        year: '2026',
    },
    {
        issuer: 'Coursera',
        title: 'Meta Front-End Developer Specialization (PDF)',
        href: '/files/Coursera.pdf',
        year: '2023',
    },
    {
        issuer: 'Leapsome',
        title: 'Security Basics (PDF)',
        href: '/files/Security_Basics.pdf',
        year: '2021',
    },
];

export const contactLinks = {
    email: 'moelzerpeter@gmail.com',
    github: 'https://github.com/peterle95',
    linkedin: 'https://www.linkedin.com/in/peter-moelzer/',
};

/** Public URL for CV download (matches outputs.tsx) */
export const cvPdfPublicPath = '/files/peter_moelzer_cv.pdf';

export function projectJsonFilename(title: string): string {
    const base = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    return `${base || 'project'}.json`;
}

/** JSON-style records for terminal / structured UI (array of string-only objects). */
export type StringRecord = Record<string, string>;

export function aboutAsRecords(): StringRecord[] {
    return aboutParagraphs.map((text) => ({ paragraph: text }));
}

export function projectsAsRecords(): StringRecord[] {
    return portfolioProjects.map((p) => {
        const r: StringRecord = {
            title: p.title,
            description: p.description,
            stack: p.stack,
            repo: p.repo,
        };
        if (p.live && p.live !== '#') {
            r.live = p.live;
        }
        return r;
    });
}

export function educationAsRecords(): StringRecord[] {
    return educationHistory.map((e) => ({
        institution: e.institution,
        program: e.program,
        period: e.period,
    }));
}

export function workAsRecords(): StringRecord[] {
    return workExperience.map((w) => ({
        company: w.company,
        role: w.role,
        period: w.period,
    }));
}

export function credentialsAsRecords(): StringRecord[] {
    return credentialItems.map((c) => ({
        issuer: c.issuer,
        title: c.title,
        href: c.href,
        year: c.year,
    }));
}

export function contactAsRecords(): StringRecord[] {
    return [
        {
            email: contactLinks.email,
            github: contactLinks.github,
            linkedin: contactLinks.linkedin,
        },
    ];
}

export function cvAsRecords(): StringRecord[] {
    return [
        {
            message: 'You can view or download my cv by clicking the link below.',
            pdf: cvPdfPublicPath,
        },
    ];
}
