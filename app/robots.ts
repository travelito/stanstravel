import type { MetadataRoute } from "next";

const siteUrl = "https://example-karvon.com"; // TODO: replace with the real production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
