import { VFSDirectory } from './virtual-filesystem';

export const portfolioContent: VFSDirectory = {
    type: 'directory',
    name: '/',
    path: '/',
    children: {
        'about': {
            type: 'directory',
            name: 'about',
            path: '/about',
            children: {
                'bio.txt': {
                    type: 'file',
                    name: 'bio.txt',
                    path: '/about/bio.txt',
                    fileType: 'text',
                    content: 'Hi, I\'m Peter Mölzer.\nI was born in Genoa (Italy) and since 2014 I live in Berlin.\n\nEconomist transitioning into software engineering, driven by a fascination with how technology transformers data into actionable insights.'
                },
                'now.md': {
                    type: 'file',
                    name: 'now.md',
                    path: '/about/now.md',
                    fileType: 'markdown',
                    content: 'Currently finishing my further training in computer science at 42 school Berlin.'
                }
            }
        },
        'projects': {
            type: 'directory',
            name: 'projects',
            path: '/projects',
            children: {
                'transcendence.json': {
                    type: 'file',
                    name: 'transcendence.json',
                    path: '/projects/transcendence.json',
                    fileType: 'json',
                    content: JSON.stringify({
                        title: 'Transcendence',
                        description: 'Final project of 42 Core Curriculum. A platform for multiple games showcasing different technologies.',
                        stack: ['Next.js', 'TypeScript', 'React', 'Prisma', 'Tailwind CSS'],
                        repo: 'https://github.com/peterle95/transcendence'
                    }, null, 2)
                },
                'shellfolio.json': {
                    type: 'file',
                    name: 'shellfolio.json',
                    path: '/projects/shellfolio.json',
                    fileType: 'json',
                    content: JSON.stringify({
                        title: 'Shellfolio',
                        description: 'Personal portfolio webpage simulating an interactive shell.',
                        stack: ['TypeScript', 'React', 'Next.js'],
                        live: 'https://petermoelzer-shellfolio.vercel.app/',
                        repo: 'https://github.com/peterle95/shellfolio'
                    }, null, 2)
                }
            }
        },
        'contact': {
            type: 'directory',
            name: 'contact',
            path: '/contact',
            children: {
                'links.json': {
                    type: 'file',
                    name: 'links.json',
                    path: '/contact/links.json',
                    fileType: 'json',
                    content: JSON.stringify({
                        email: 'moelzerpeter@gmail.com',
                        github: 'https://github.com/peterle95',
                        linkedin: 'https://www.linkedin.com/in/peter-moelzer/'
                    }, null, 2)
                }
            }
        },
        'system': {
            type: 'directory',
            name: 'system',
            path: '/system',
            children: {
                'motd.txt': {
                    type: 'file',
                    name: 'motd.txt',
                    path: '/system/motd.txt',
                    fileType: 'text',
                    content: 'Welcome to Shellfolio OS v1.0.0.'
                }
            }
        }
    }
};
