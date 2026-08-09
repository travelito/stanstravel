import type { MetadataRoute } from "next";

const siteUrl = "https://www.stanstravel.com"; // TODO: replace with the real production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
