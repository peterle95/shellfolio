import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Security — Peter Mölzer',
  description:
    'How this personal portfolio handles encryption, hosting, access, and vulnerability reports, with its incident, testing, and certification status.',
  alternates: {
    canonical: 'https://petermoelzer-shellfolio.vercel.app/security',
  },
};

const link = 'text-fuchsia-300 underline';
const heading = 'font-bold text-white';

export default function SecurityPage() {
  return (
    <LegalPage title="Security">
      <p>Last updated: November 20, 2026</p>
      <p>
        Peter Mölzer operates this personal portfolio website. This page states what is in place and what is not.
        For how personal data is processed, see the <Link className={link} href="/privacy-policy" prefetch={false}>privacy policy</Link>.
      </p>

      <h2 className={heading}>Reporting a vulnerability</h2>
      <p>
        Email <a className={link} href="mailto:moelzerpeter@proton.me">moelzerpeter@proton.me</a> or use{' '}
        <a className={link} href="https://github.com/peterle95/shellfolio/security/advisories/new" rel="noopener noreferrer" target="_blank">GitHub private vulnerability reporting</a>.
        I aim to acknowledge reports within 7 days on a best-effort basis. There is no bug bounty.
      </p>
      <p>
        I will not take legal action against good-faith research that avoids accessing other people&apos;s data, does not disrupt the site,
        and allows reasonable time for a fix before public disclosure.
      </p>

      <h2 className={heading}>Encryption</h2>
      <p>
        The site is served over HTTPS only. Plain HTTP requests are permanently redirected to HTTPS, and responses carry HTTP Strict
        Transport Security. Certificates are issued and renewed by the hosting provider.
      </p>
      <p>
        The site has no accounts, forms, or database and stores no data you submit, so there is no server-side store of visitor data to
        encrypt at rest. Preferences you set are kept in your own browser&apos;s storage.
      </p>

      <h2 className={heading}>Hosting and data location</h2>
      <p>
        The site is hosted on Vercel. Pages are built in advance and delivered from Vercel&apos;s edge network; no visitor-submitted data
        is stored. How hosting and optional measurement providers process technical data is described in the privacy policy.
      </p>

      <h2 className={heading}>Access controls</h2>
      <p>
        The site is run by one person. I am the only member of the source repository and the hosting project, and both accounts are
        protected with multi-factor authentication. The source code is public; only I can change it. Deployment settings and secrets
        are kept in the hosting platform, not in the repository. The site has no login or admin area. Automated traffic is subject to
        a managed browser challenge at the hosting edge.
      </p>

      <h2 className={heading}>Incident history</h2>
      <p>No security incidents have been identified as of November 2026.</p>

      <h2 className={heading}>Penetration testing</h2>
      <p>
        No third-party security audit or penetration test has been carried out. Findings are welcome through the reporting routes above.
      </p>

      <h2 className={heading}>Certifications</h2>
      <p>
        This site holds no security certifications (such as SOC 2 or ISO 27001) and displays no compliance badges (such as GDPR or
        HIPAA). These programmes are designed for organisations that process customer data and do not apply to a personal portfolio.
      </p>
    </LegalPage>
  );
}
