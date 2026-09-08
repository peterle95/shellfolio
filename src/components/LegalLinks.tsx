import Link from 'next/link';

export function LegalLinks() {
  return (
    <nav aria-label="Legal" className="fixed bottom-3 right-3 z-40 flex gap-3 rounded border border-white/30 bg-black/80 px-3 py-2 text-xs text-white sm:right-6">
      <Link className="underline focus:outline-none focus:ring-2 focus:ring-white" href="/privacy-policy" prefetch={false}>Privacy policy</Link>
    </nav>
  );
}
