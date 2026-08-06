import type {Metadata} from 'next';
import './globals.css';
import { Source_Code_Pro } from 'next/font/google';
import { PrivacyConsent } from '@/components/PrivacyConsent';
import { Telemetry } from '@/components/Telemetry';

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
        <link rel="icon" href="/favicon-16x16.png" type="image/jpeg" />
      </head>
      <body className={`${sourceCodePro.variable} font-body antialiased`}>
        {children} 
        <Telemetry />
        <PrivacyConsent />
      </body>
    </html>
  );
}
