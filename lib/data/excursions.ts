// Data now comes from Supabase (table `excursions`) instead of a static
// array. Every page calling getAllExcursions / getExcursionBySlug keeps
// working unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import { supabase } from "@/lib/supabase";
import { resolvePhotos, type Photo } from "@/lib/storage";
import type { PriceTier, PricingModel } from "@/lib/pricing";

export type Excursion = {
  slug: string;
  city: string;
  durationHours: number;
  priceUsd: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  image: string | null;
  photos: Photo[];
  highlights: Record<Locale, string[]> | null;
  itinerary: Record<Locale, string[]> | null;
  included: Record<Locale, string[]> | null;
  notIncluded: Record<Locale, string[]> | null;
  tourType: string | null;
  guideLanguage: string | null;
  pickupIncluded: boolean | null;
  pricingModel: PricingModel;
  priceTiers: PriceTier[] | null;
};

type ExcursionRow = {
  slug: string;
  city: string;
  duration_hours: number;
  price_usd: number;
  updated_at: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  image: string | null;
  photos: Photo[];
  highlights: Record<Locale, string[]> | null;
  itinerary: Record<Locale, string[]> | null;
  included: Record<Locale, string[]> | null;
  not_included: Record<Locale, string[]> | null;
  tour_type: string | null;
  guide_language: string | null;
  pickup_included: boolean | null;
  pricing_model: PricingModel;
  price_tiers: PriceTier[] | null;
};

function rowToExcursion(row: ExcursionRow): Excursion {
  return {
    slug: row.slug,
    city: row.city,
    durationHours: row.duration_hours,
    priceUsd: row.price_usd,
    updatedAt: row.updated_at,
    title: row.title,
    summary: row.summary,
    image: row.image,
    photos: resolvePhotos(row.photos, row.image),
    highlights: row.highlights,
    itinerary: row.itinerary,
    included: row.included,
    notIncluded: row.not_included,
    tourType: row.tour_type,
    guideLanguage: row.guide_language,
    pickupIncluded: row.pickup_included,
    pricingModel: row.pricing_model,
    priceTiers: row.price_tiers,
  };
}

export async function getAllExcursions(): Promise<Excursion[]> {
  const { data, error } = await supabase
    .from("excursions")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("getAllExcursions failed:", error.message);
    return [];
  }
  return (data as ExcursionRow[]).map(rowToExcursion);
}

// Groups excursions by city, cities ordered by excursion count (descending)
// and excursions within a city ordered alphabetically by localized title.
export function groupExcursionsByCity(
  excursions: Excursion[],
  locale: Locale
): [string, Excursion[]][] {
  return Object.entries(
    excursions.reduce<Record<string, Excursion[]>>((acc, excursion) => {
      (acc[excursion.city] ??= []).push(excursion);
      return acc;
    }, {})
  )
    .map(
      ([city, items]): [string, Excursion[]] => [
        city,
        [...items].sort((a, b) => a.title[locale].localeCompare(b.title[locale], locale)),
      ]
    )
    .sort((a, b) => b[1].length - a[1].length);
}

export async function getExcursionBySlug(
  slug: string
): Promise<Excursion | undefined> {
  const { data, error } = await supabase
    .from("excursions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getExcursionBySlug failed:", error.message);
    return undefined;
  }
  return rowToExcursion(data as ExcursionRow);
}
