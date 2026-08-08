// This file is the single source of truth for tours shown on the site.
// Data now comes from Supabase (table `tours`) instead of a static array.
// Every page that calls getAllTours / getTourBySlug keeps working
// unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import type { Duration } from "@/lib/duration";
import { supabase } from "@/lib/supabase";

export type Tour = {
  slug: string;
  city: string;
  duration: Duration;
  priceUsd: number;
  updatedAt: string; // ISO date — real edit date, used for sitemap lastmod
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  description: Record<Locale, string[]>; // paragraphs
  highlights: Record<Locale, string[]>;
  image: string;
};

// Shape of a row as it comes back from Supabase (snake_case, jsonb columns).
type TourRow = {
  slug: string;
  city: string;
  duration_value: number;
  duration_unit: "hours" | "days";
  price_usd: number;
  updated_at: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  description: Record<Locale, string[]>;
  highlights: Record<Locale, string[]>;
  image: string | null;
};

function rowToTour(row: TourRow): Tour {
  return {
    slug: row.slug,
    city: row.city,
    duration: { value: row.duration_value, unit: row.duration_unit },
    priceUsd: row.price_usd,
    updatedAt: row.updated_at,
    title: row.title,
    summary: row.summary,
    description: row.description,
    highlights: row.highlights,
    image:
      row.image ??
      "https://images.unsplash.com/photo-1596395819057-e34ea1f2e2c0?q=80&w=1200",
  };
}

export async function getAllTours(): Promise<Tour[]> {
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("getAllTours failed:", error.message);
    return [];
  }
  return (data as TourRow[]).map(rowToTour);
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getTourBySlug failed:", error.message);
    return undefined;
  }
  return rowToTour(data as TourRow);
}
