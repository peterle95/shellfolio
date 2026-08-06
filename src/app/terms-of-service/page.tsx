import { LegalPage } from '@/components/LegalPage';

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service">
      <p>Last updated: August 6, 2026</p>
      <p>This is a personal portfolio operated by Peter Mölzer. Content is provided for general information and may change without notice.</p>
      <h2 className="font-bold text-white">Use of content</h2>
      <p>You may view this site for personal, non-commercial purposes. Do not copy, modify, distribute, or use portfolio content, project descriptions, or downloadable materials as your own without permission.</p>
      <h2 className="font-bold text-white">External links</h2>
      <p>This site links to third-party websites. Peter Mölzer does not control their content, availability, or privacy practices.</p>
      <h2 className="font-bold text-white">No warranty</h2>
      <p>The site and its content are provided without warranties to the extent permitted by law. Nothing here excludes liability that cannot legally be excluded.</p>
      <h2 className="font-bold text-white">Contact</h2>
      <p>Questions about these terms: <a className="text-fuchsia-300 underline" href="mailto:moelzerpeter@gmail.com">moelzerpeter@gmail.com</a>.</p>
    </LegalPage>
  );
}
