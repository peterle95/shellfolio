import { LegalPage } from '@/components/LegalPage';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: August 6, 2026</p>
      <p>Peter Mölzer operates this personal portfolio website. Contact: <a className="text-fuchsia-300 underline" href="mailto:moelzerpeter@gmail.com">moelzerpeter@gmail.com</a>.</p>
      <h2 className="font-bold text-white">What this site processes</h2>
      <p>The site may process technical request data, browser storage used for preferences and terminal features, and optional analytics data from Vercel Analytics, Vercel Speed Insights, and Microsoft Clarity. External links only load when you select them.</p>
      <h2 className="font-bold text-white">Purpose and choices</h2>
      <p>Technical data supports delivery and security. Preference storage supports site functionality. Optional services measure visits, performance, and session interactions. Use Privacy settings to change optional choices at any time.</p>
      <h2 className="font-bold text-white">Your rights</h2>
      <p>Subject to GDPR conditions, you may request access, correction, deletion, restriction, portability, or object to processing. Where processing relies on consent, withdraw it through Privacy settings. You may also complain to a data protection supervisory authority.</p>
      <h2 className="font-bold text-white">Providers and retention</h2>
      <p>Hosting, delivery, and optional measurement providers may process technical data according to their own terms and privacy notices. Retention depends on the provider and site operation; no contact form or account system is provided by this site.</p>
    </LegalPage>
  );
}
