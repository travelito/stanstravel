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
