/** Single source for portfolio copy — used by outputs.tsx and vfs-content.ts */

export const aboutParagraphs = [
    'I was born in Genoa (Italy) and since 2014 I live in Berlin.',
    'Software Engineer combining a rigorous computer science education from 42 Berlin with a B.Sc. in Economics at Humboldt University. Bringing professional experience from leading European FinTechs (Klarna, Clark). I specialize in TypeScript, React, and Next.js, with a proven ability to bridge complex business logic, such as revenue sharing and market analytics, with scalable technical execution.',
    'I generally like to read books, write, play the guitar and dj.',
];

export const aboutBioPlainText = aboutParagraphs.join('\n\n');

export type ProjectImage = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export type ProjectVideo = {
    src: string;
    /** Marks the approved shared Finance Tracker placeholder (docs/project-content-34.md). */
    sharedPlaceholder?: boolean;
};

const sharedFinanceVideo: ProjectVideo = {
    src: '/videos/finance_tracker/finance_tracker-silent.mp4',
    sharedPlaceholder: true,
};

// Owner-approved release exception and exact copy: docs/project-content-34.md.
const sharedFinancePoster: ProjectImage = {
    src: '/videos/finance_tracker/finance_tracker-poster.webp',
    alt: 'Shared placeholder: Finance Tracker dashboard with a daily spending target and expense list.',
    width: 1280,
    height: 720,
};

// Owner-recorded project media. jobFinder's demo footer states:
// "Demonstration · Fictional career materials · Sample provider outputs"
// — the project description says the same so no clip is mistaken for real output.
const fermentStationVideo: ProjectVideo = {
    src: '/videos/fermentStation/fermentStation-silent.mp4',
};

const fermentStationPoster: ProjectImage = {
    src: '/videos/fermentStation/fermentStation-poster.webp',
    alt: 'FermentStation illustration: a clip-top jar of fermenting vegetables beside the slogan "Good things take time."',
    width: 1280,
    height: 720,
};

const jobFinderVideo: ProjectVideo = {
    src: '/videos/jobFinder/jobFinder-silent.mp4',
};

const jobFinderPoster: ProjectImage = {
    src: '/videos/jobFinder/jobFinder-poster.webp',
    alt: 'jobFinder evaluation screen: a 70 out of 100 partial-match recommendation beside a review of established strengths and experience to confirm.',
    width: 1280,
    height: 720,
};

const petVideo: ProjectVideo = {
    src: '/videos/pet/pet-silent.mp4',
};

const petPoster: ProjectImage = {
    src: '/videos/pet/pet-poster.webp',
    alt: 'Pet demonstration desktop: the slogan "Your desktop. Now with company." beside a pixel-art companion on a macOS desktop.',
    width: 1280,
    height: 720,
};

const pelosettiImage: ProjectImage = {
    src: '/images/ipelosetti.png',
    alt: 'I Pelosetti di Silvana Onlus shelter website with sections for temporary fostering, fostering towards adoption, and social volunteering.',
    width: 1424,
    height: 728,
};

const githubProfile: ProjectImage = {
    src: '/images/github_profile.png',
    alt: 'My GitHub profile screenshot showing repositories, contributions, and pinned projects.',
    width: 1280,
    height: 720,
};

export type PortfolioProject = {
    title: string;
    description: string;
    shortDescription?: string;
    stack: string;
    live?: string;
    repo: string;
    image?: ProjectImage;
    video?: ProjectVideo;
};

export const portfolioProjects: PortfolioProject[] = [
    // jobFinder and Pet: repositories are private for now ('#' = no public link).
    // Confirm the stack strings and add repo URLs before publication.
    {
        title: 'Pet',
        // shortDescription: 'Your desktop. Now with company.',
        image: petPoster,
        video: petVideo,
        description:
            'Desktop companion: a pixel pet walks across your desktop while you work and can be dragged anywhere, paired with a Pokéball-styled Pomodoro focus timer and a task calendar that tracks daily tasks with streaks. Repository stays private for now.',
        stack: 'TypeScript',
        repo: '#',
    },
    {
        title: 'WEB CONSULTANT & DEVELOPER – I PELOSETTI DI SILVANA ONLUS',
        shortDescription: 'Pro-bono WordPress fixes for animal listings and SEO.',
        image: pelosettiImage,
        description:
            'Provided pro-bono technical consulting for a non-profit animal shelter, diagnosing and resolving critical WordPress/WooCommerce issues affecting animal listing pages and site SEO',
        stack: 'WordPress, WooCommerce, Elementor',
        live: 'https://pelosettidisilvana.org/',
        repo: '#',
    },
    {
        title: 'jobFinder',
        shortDescription: 'Evaluate job postings and tailor your next application.',
        image: jobFinderPoster,
        video: jobFinderVideo,
        description:
            'Windows-first assistant with OpenCode connected: add a full job posting, evaluate it against your saved experience sources and corrections, and review what matches and what needs your confirmation — a starting point for the evidence, not a final decision. Then generate an editable tailored CV or cover letter and save it as PDF. The released demo uses fictional career materials and sample provider outputs.',
        stack: 'TypeScript, React',
        repo: '#',
    },
    {
        title: 'FermentStation',
        shortDescription: 'Track fermentation locally, on desktop or Android.',
        image: fermentStationPoster,
        video: fermentStationVideo,
        description:
            'Local-first fermentation tracker. 70+ tests, desktop + Android packaging',
        stack: 'React, TypeScript, Vite, Tauri 2, Capacitor',
        live: '#',
        repo: 'https://github.com/peterle95/fermentstation',
    },
    {
        title: 'Printing Press CLIs',
        shortDescription: '23 command-line tools for API automation.',
        image: sharedFinancePoster,
        video: sharedFinanceVideo,
        description:
            'WSL monorepo of 23 CLI tools wrapping public APIs for agent-friendly automation. Preview: shared Finance Tracker placeholder, not this project, using fictional data.',
        stack: 'Go/Cobra, Python, Node/TypeScript',
        live: '#',
        repo: 'https://github.com/peterle95/printing-press-clis',
    },
    {
        title: 'Transcendence',
        shortDescription: 'A multi-game platform built at 42, currently in development.',
        image: sharedFinancePoster,
        video: sharedFinanceVideo,
        description:
            'Final project of 42 Core Curriculum. Together we 4 other fellow 42oers we created a platform for multiple games showcasing different technologies and games. (Currently in development) Preview: shared Finance Tracker placeholder, not this project, using fictional data.',
        stack: 'Next.js, TypeScript, React, Prisma, Tailwind CSS',
        live: '#',
        repo: 'https://github.com/transcendence42spacewars/transcendence',
    },
    {
        title: 'Webserv',
        shortDescription: 'A custom HTTP server built in C++98.',
        image: sharedFinancePoster,
        video: sharedFinanceVideo,
        description:
            "Custom HTTP server implemented in C++98. This project aims to provide a deep understanding of how HTTP servers operate, focusing on core network aspects and non-blocking behavior to handle multiple concurrent connections efficiently. The server's primary function is to receive HTTP requests from clients, process these requests, and send appropriate HTTP responses back. Preview: shared Finance Tracker placeholder, not this project, using fictional data.",
        stack: 'C++98, Unix, Nginx, JavaScript, HTML, CSS, Python',
        live: '#',
        repo: 'https://github.com/peterle95/webserv',
    },
    {
        title: 'Shellfolio',
        shortDescription: 'An interactive portfolio styled as a command-line shell.',
        image: sharedFinancePoster,
        video: sharedFinanceVideo,
        description:
            'Personal portfolio webpage simulating shell. It makes my projects and other information interactive and fun. Preview: shared Finance Tracker placeholder, not this project, using fictional data.',
        stack: 'TypeScript, React, Next.js',
        live: 'https://petermoelzer-shellfolio.vercel.app/',
        repo: 'https://github.com/peterle95/shellfolio',
    },
    /* {
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
    }, */
    {
        title: 'More Projects',
        shortDescription: 'Explore more projects and contributions on GitHub.',
        image: githubProfile,
        description: 'Check out my GitHub for more projects and contributions.',
        stack: 'C, C++, JavaScript, TypeScript, React, ...',
        repo: 'https://github.com/peterle95/',
    },
];

export const educationHistory = [
    {
        institution: '42 Berlin',
        program: 'Computer Science & Software Engineering',
        href: '/files/certificate_core_completion.pdf',
        period: '2023 - 2026',
    },
    {
        institution: 'Humboldt-Universität zu Berlin',
        program: 'Bachelor of Science, Economics',
        href: '/files/BScEconomics.pdf',
        period: '2015 - 2019',
    },
];

export const workExperience = [
    { company: 'InnoBee', role: 'Frontend Developer', period: '2025 - 2026' },
    { company: 'Yellow Srl', role: 'Web Development Intern', period: '2024 - 2025' },
    { company: 'Klarna', role: 'Business Development Associate', period: '2022 - 2023' },
    { company: 'Clark', role: 'Junior Partnership Marketing', period: '2021 - 2022' },
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
    email: 'moelzerpeter@proton.me',
    github: 'https://github.com/peterle95',
    linkedin: 'https://www.linkedin.com/in/peter-moelzer/',
};

/** Public URL for CV download (matches outputs.tsx) */
export const cvPdfPublicPath = '/files/petermoelzerEN.pdf';

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
        href: e.href,
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
