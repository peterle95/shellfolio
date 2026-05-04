import React from 'react';
import { StructuredRecordsOutput } from '@/components/shellfolio/terminal/StructuredRecordsOutput';
import { HELP_MENU, HELP_MENU_ORDER } from '@/lib/terminal/commands/help-menu';
import {
    aboutAsRecords,
    projectsAsRecords,
    educationAsRecords,
    workAsRecords,
    credentialsAsRecords,
    contactAsRecords,
    cvAsRecords,
} from '@/lib/portfolio-data';

export const Welcome = () => (
    <div>
        <h1 className="text-2xl font-bold text-primary mb-4">Welcome to Peter Mölzer's Shellfolio!</h1>
        <p>This is my interactive portfolio.</p>
        <p className="mt-2">Type <span className="font-bold text-primary">'help'</span> to see a list of available commands.</p>
    </div>
);

export const Help = () => (
    <StructuredRecordsOutput
        records={HELP_MENU_ORDER.map((command) => ({
            command,
            description: HELP_MENU[command],
        }))}
    />
);

export const About = () => <StructuredRecordsOutput records={aboutAsRecords()} />;

export const Projects = () => <StructuredRecordsOutput records={projectsAsRecords()} />;

export const Education = () => <StructuredRecordsOutput records={educationAsRecords()} />;

export const WorkExperience = () => <StructuredRecordsOutput records={workAsRecords()} />;

export const Credentials = () => <StructuredRecordsOutput records={credentialsAsRecords()} />;

export const Cv = () => <StructuredRecordsOutput records={cvAsRecords()} />;

/** @deprecated Prefer {@link Cv} */
export const cv = Cv;

export const Contact = () => <StructuredRecordsOutput records={contactAsRecords()} />;

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
