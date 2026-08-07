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
};

module.exports = nextConfig;
