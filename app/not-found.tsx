import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <p className="font-headline text-headline-lg text-deep-navy mb-2">404</p>
        <p className="font-body text-body-md text-slate-gray mb-6">Page not found.</p>
        <Link href="/" className="font-label text-label-md text-primary hover:text-metallic-gold">
          Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
