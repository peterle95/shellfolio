import type {Metadata} from 'next';
import './globals.css';
import { Source_Code_Pro } from 'next/font/google';
import { PrivacyConsent } from '@/components/PrivacyConsent';
import { Telemetry } from '@/components/Telemetry';
import { LegalLinks } from '@/components/LegalLinks';

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  title: 'Peter Mölzer',
  description: 'An interactive terminal portfolio for Peter Mölzer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/blonde.png" type="image/png" />
      </head>
      <body className={`${sourceCodePro.variable} font-body antialiased`}>
        {children} 
        <Telemetry />
        <PrivacyConsent />
        <LegalLinks />
      </body>
    </html>
  );
}
