import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'LifeBot Personal — Privacy Policy',
  description:
    'Privacy Policy for LifeBot Personal: a single-user personal app that reads Google Calendar events read-only and user-assigned Trello cards.',
  alternates: {
    canonical: 'https://petermoelzer-shellfolio.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="LifeBot Personal — Privacy Policy">
      <p>Last updated: October 11, 2026</p>
      <p>
        LifeBot Personal is a single-user personal app operated by Peter Mölzer for his own use.
        Contact: <a className="text-fuchsia-300 underline" href="mailto:moelzerpeter@gmail.com">moelzerpeter@gmail.com</a>.
      </p>
      <h2 className="font-bold text-white">What data is accessed</h2>
      <p>
        LifeBot Personal reads Google Calendar event titles and times on a read-only basis to prepare
        daily briefings, and reads cards assigned to the user in Trello for the same purpose.
      </p>
      <h2 className="font-bold text-white">How data is used and stored</h2>
      <p>
        Calendar and Trello data is used only to generate the user&apos;s own briefings, habit reviews,
        and health reviews. Data stays on the user&apos;s own server and is never sold or shared
        with third parties.
      </p>
      <h2 className="font-bold text-white">Google data use</h2>
      <p>
        LifeBot Personal&apos;s use of information received from Google APIs adheres to the{' '}
        <a
          className="text-fuchsia-300 underline"
          href="https://developers.google.com/terms/api-services-user-data-policy"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. Google data is used only for the purposes stated
        above — providing the user&apos;s own daily briefings and reviews — and is never used for
        advertising, sold, or shared.
      </p>
    </LegalPage>
  );
}
