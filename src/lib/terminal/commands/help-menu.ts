/** Ordered entries shown when the user runs `help` (friendly shortcuts; cd/ls/cat etc. stay available). */
export const HELP_MENU_ORDER = [
    'about',
    'projects',
    'education',
    'work',
    'cv',
    'contact',
    'credentials',
    'help',
    'clear',
] as const;

export const HELP_MENU: Record<(typeof HELP_MENU_ORDER)[number], string> = {
    about: 'Learn more about me.',
    projects: 'View my recent projects.',
    education: 'Display my education history.',
    work: 'Show my work experience.',
    cv: 'Get a copy of my cv.',
    contact: 'Find out how to reach me.',
    credentials: 'View my credentials and certifications.',
    help: 'Display this list of commands.',
    clear: 'Clear the terminal screen.',
};
