import Link from "next/link";
import type { Metadata } from "next";

// This renders with an HTTP 404 status automatically in Next.js App Router
// whenever notFound() is called, or for any route that doesn't match a page.
// It intentionally does NOT reuse homepage content or canonical — that was
// the root cause of the soft-404 problem on the previous site.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-plaster text-ink font-body">
        <div className="text-center px-6">
          <h1 className="font-display text-3xl mb-3">Page not found</h1>
          <p className="text-ink/70 mb-6">
            This page doesn&apos;t exist — it may have been moved or removed.
          </p>
          <Link href="/ru" className="text-turquoise hover:text-indigo font-mono text-sm">
            ← Back to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
