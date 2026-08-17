// Data now comes from Supabase (table `transfers`) instead of a static
// array. Every page calling getAllTransfers / getTransferBySlug keeps
// working unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import { supabase } from "@/lib/supabase";
import { resolvePhotos, type Photo } from "@/lib/storage";

export type Transfer = {
  slug: string;
  fromCity: string;
  toCity: string;
  transportType: string;
  priceUsd: number;
  durationHours: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  photos: Photo[];
};

type TransferRow = {
  slug: string;
  from_city: string;
  to_city: string;
  transport_type: string;
  price_usd: number;
  duration_hours: number;
  updated_at: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  photos: Photo[];
};

function rowToTransfer(row: TransferRow): Transfer {
  return {
    slug: row.slug,
    fromCity: row.from_city,
    toCity: row.to_city,
    transportType: row.transport_type,
    priceUsd: row.price_usd,
    durationHours: row.duration_hours,
    updatedAt: row.updated_at,
    title: row.title,
    summary: row.summary,
    photos: resolvePhotos(row.photos, null),
  };
}

export async function getAllTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .order("from_city", { ascending: true });

  if (error) {
    console.error("getAllTransfers failed:", error.message);
    return [];
  }
  return (data as TransferRow[]).map(rowToTransfer);
}

export async function getTransferBySlug(slug: string): Promise<Transfer | undefined> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getTransferBySlug failed:", error.message);
    return undefined;
  }
  return rowToTransfer(data as TransferRow);
}
