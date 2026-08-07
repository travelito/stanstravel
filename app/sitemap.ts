import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { getAllTours } from "@/lib/data/tours";
import { getAllExcursions } from "@/lib/data/excursions";
import { getAllTransfers } from "@/lib/data/transfers";
import { getAllTrainTickets } from "@/lib/data/train-tickets";

const siteUrl = "https://www.stanstravel.com"; // TODO: replace with the real production domain

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static routes
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    });
    entries.push({
      url: `${siteUrl}/${locale}/tours`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    });
    entries.push({
      url: `${siteUrl}/${locale}/excursions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    });
    entries.push({
      url: `${siteUrl}/${locale}/transfers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    });
    entries.push({
      url: `${siteUrl}/${locale}/train-tickets`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    });
    entries.push({
      url: `${siteUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    });

    // Tour detail pages — generated straight from the data source, so a
    // sitemap entry can never point to a tour that doesn't exist.
    for (const tour of getAllTours()) {
      entries.push({
        url: `${siteUrl}/${locale}/tours/${tour.slug}`,
        lastModified: new Date(tour.updatedAt), // real edit date, not "today"
        changeFrequency: "monthly",
      });
    }

    for (const excursion of getAllExcursions()) {
      entries.push({
        url: `${siteUrl}/${locale}/excursions/${excursion.slug}`,
        lastModified: new Date(excursion.updatedAt),
        changeFrequency: "monthly",
      });
    }

    for (const transfer of getAllTransfers()) {
      entries.push({
        url: `${siteUrl}/${locale}/transfers/${transfer.slug}`,
        lastModified: new Date(transfer.updatedAt),
        changeFrequency: "monthly",
      });
    }

    for (const ticket of getAllTrainTickets()) {
      entries.push({
        url: `${siteUrl}/${locale}/train-tickets/${ticket.slug}`,
        lastModified: new Date(ticket.updatedAt),
        changeFrequency: "monthly",
      });
    }
  }

  return entries;
}
