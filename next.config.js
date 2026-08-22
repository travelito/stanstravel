/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // TODO: replace YOUR-PROJECT with your real Supabase project ref
      // once Supabase Storage is connected, so real tour photos load fast
      // and get automatic resizing/compression from Next.js.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    // Photos are already pre-resized into thumb/medium/full variants at
    // upload time (see components/admin/PhotoUploader.tsx), so Vercel's
    // on-the-fly optimizer was mostly redundant — and once its monthly
    // transformation quota was exhausted, uncached sizes started failing
    // with 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED (confirmed live:
    // some photo/width combos 200, others 402, purely by cache luck).
    // Serving the pre-sized originals directly avoids that failure mode
    // entirely, on every browser, for no real quality loss.
    unoptimized: true,
  },
  async redirects() {
    // A Server Component redirect() from app/page.tsx was observed live
    // returning a 307 with no Location header (bare "/" served a stale
    // Vercel-cached shell) — a config-level redirect is resolved before
    // route rendering, so it can't get stuck like that.
    return [{ source: "/", destination: "/ru", permanent: true }];
  },
};

module.exports = nextConfig;
