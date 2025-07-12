import React from 'react';
import { About, Contact, Help, Projects, Resume, NotFound, Education, WorkExperience, Credentials } from './outputs';

export const commandList = [
    { cmd: 'about', desc: 'Learn more about me.' },
    { cmd: 'projects', desc: 'View my recent projects.' },
    { cmd: 'education', desc: 'Display my education history.' },
    { cmd: 'work', desc: 'Show my work experience.' },
    { cmd: 'resume', desc: 'Get a copy of my resume.' },
    { cmd: 'contact', desc: 'Find out how to reach me.' },
    { cmd: 'credentials', desc: 'View my credentials and certifications.' },
    { cmd: 'help', desc: 'Display this list of commands.' },
    { cmd: 'clear', desc: 'Clear the terminal screen.' },
];

export const commands: { [key: string]: () => React.ReactNode } = {
  help: () => React.createElement(Help),
  about: () => React.createElement(About),
  projects: () => React.createElement(Projects),
  resume: () => React.createElement(Resume),
  contact: () => React.createElement(Contact),
  education: () => React.createElement(Education),
  work: () => React.createElement(WorkExperience),
  credentials: () => React.createElement(Credentials),
  whoops: () => React.createElement(NotFound),
};
