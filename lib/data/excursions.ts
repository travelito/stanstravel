// Data now comes from Supabase (table `excursions`) instead of a static
// array. Every page calling getAllExcursions / getExcursionBySlug keeps
// working unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import { supabase } from "@/lib/supabase";

export type Excursion = {
  slug: string;
  city: string;
  durationHours: number;
  priceUsd: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

type ExcursionRow = {
  slug: string;
  city: string;
  duration_hours: number;
  price_usd: number;
  updated_at: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
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
