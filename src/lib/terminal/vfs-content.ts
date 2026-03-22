import { VFSDirectory } from './virtual-filesystem';
import {
    aboutBioPlainText,
    portfolioProjects,
    projectJsonFilename,
    educationHistory,
    workExperience,
    credentialItems,
    contactLinks,
    cvPdfPublicPath,
} from '../portfolio-data';

const projectChildren = Object.fromEntries(
    portfolioProjects.map((p) => {
        const filename = projectJsonFilename(p.title);
        return [
            filename,
            {
                type: 'file' as const,
                name: filename,
                path: `/projects/${filename}`,
                fileType: 'json' as const,
                content: JSON.stringify(
                    {
                        title: p.title,
                        description: p.description,
                        stack: p.stack,
                        ...(p.live !== undefined && p.live !== '' ? { live: p.live } : {}),
                        repo: p.repo,
                    },
                    null,
                    2
                ),
            },
        ];
    })
);

export const portfolioContent: VFSDirectory = {
    type: 'directory',
    name: '/',
    path: '/',
    children: {
        about: {
            type: 'directory',
            name: 'about',
            path: '/about',
            children: {
                'bio.txt': {
                    type: 'file',
                    name: 'bio.txt',
                    path: '/about/bio.txt',
                    fileType: 'text',
                    content: aboutBioPlainText,
                },
                'now.md': {
                    type: 'file',
                    name: 'now.md',
                    path: '/about/now.md',
                    fileType: 'markdown',
                    content: 'Currently finishing my further training in computer science at 42 school Berlin.',
                },
            },
        },
        projects: {
            type: 'directory',
            name: 'projects',
            path: '/projects',
            children: projectChildren,
        },
        contact: {
            type: 'directory',
            name: 'contact',
            path: '/contact',
            children: {
                'links.json': {
                    type: 'file',
                    name: 'links.json',
                    path: '/contact/links.json',
                    fileType: 'json',
                    content: JSON.stringify(contactLinks, null, 2),
                },
            },
        },
        education: {
            type: 'directory',
            name: 'education',
            path: '/education',
            children: {
                'history.json': {
                    type: 'file',
                    name: 'history.json',
                    path: '/education/history.json',
                    fileType: 'json',
                    content: JSON.stringify(educationHistory, null, 2),
                },
            },
        },
        work: {
            type: 'directory',
            name: 'work',
            path: '/work',
            children: {
                'experience.json': {
                    type: 'file',
                    name: 'experience.json',
                    path: '/work/experience.json',
                    fileType: 'json',
                    content: JSON.stringify(workExperience, null, 2),
                },
            },
        },
        cv: {
            type: 'directory',
            name: 'cv',
            path: '/cv',
            children: {
                'info.txt': {
                    type: 'file',
                    name: 'info.txt',
                    path: '/cv/info.txt',
                    fileType: 'text',
                    content:
                        'Peter Mölzer — CV\n\n' +
                        `PDF: open ${cvPdfPublicPath} in the browser or run: cat cv/peter_moelzer_cv.pdf\n`,
                },
                'peter_moelzer_cv.pdf': {
                    type: 'file',
                    name: 'peter_moelzer_cv.pdf',
                    path: '/cv/peter_moelzer_cv.pdf',
                    fileType: 'link',
                    targetUrl: cvPdfPublicPath,
                },
            },
        },
        credentials: {
            type: 'directory',
            name: 'credentials',
            path: '/credentials',
            children: {
                'certifications.json': {
                    type: 'file',
                    name: 'certifications.json',
                    path: '/credentials/certifications.json',
                    fileType: 'json',
                    content: JSON.stringify({ items: credentialItems }, null, 2),
                },
            },
        },
        system: {
            type: 'directory',
            name: 'system',
            path: '/system',
            children: {
                'motd.txt': {
                    type: 'file',
                    name: 'motd.txt',
                    path: '/system/motd.txt',
                    fileType: 'text',
                    content: 'Welcome to Shellfolio OS v1.0.0.',
                },
            },
        },
    },
};
