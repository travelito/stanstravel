// This file is the single source of truth for tours shown on the site.
// Data now comes from Supabase (table `tours`) instead of a static array.
// Every page that calls getAllTours / getTourBySlug keeps working
// unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import type { Duration } from "@/lib/duration";
import { supabase } from "@/lib/supabase";
import { resolvePhotos, type Photo } from "@/lib/storage";
import type { PriceTier, PricingModel } from "@/lib/pricing";

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
  image: string | null;
  photos: Photo[];
  tourPace: string | null;
  pricingModel: PricingModel;
  priceTiers: PriceTier[] | null;
  itinerary: Record<Locale, string[]> | null;
  included: Record<Locale, string[]> | null;
  notIncluded: Record<Locale, string[]> | null;
  tourType: string | null;
  guideLanguage: string | null;
  pickupIncluded: boolean | null;
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
  photos: Photo[];
  tour_pace: string | null;
  pricing_model: PricingModel;
  price_tiers: PriceTier[] | null;
  itinerary: Record<Locale, string[]> | null;
  included: Record<Locale, string[]> | null;
  not_included: Record<Locale, string[]> | null;
  tour_type: string | null;
  guide_language: string | null;
  pickup_included: boolean | null;
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
    image: row.image,
    photos: resolvePhotos(row.photos, row.image),
    tourPace: row.tour_pace,
    pricingModel: row.pricing_model,
    priceTiers: row.price_tiers,
    itinerary: row.itinerary,
    included: row.included,
    notIncluded: row.not_included,
    tourType: row.tour_type,
    guideLanguage: row.guide_language,
    pickupIncluded: row.pickup_included,
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
