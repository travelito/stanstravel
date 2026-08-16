// Data now comes from Supabase (table `train_tickets`) instead of a static
// array. Every page calling getAllTrainTickets / getTrainTicketBySlug keeps
// working unchanged — only these two functions know about the database.

import type { Locale } from "@/lib/locales";
import { supabase } from "@/lib/supabase";

export type TrainTicket = {
  slug: string;
  fromCity: string;
  toCity: string;
  train: string;
  priceUsd: number;
  durationHours: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

type TrainTicketRow = {
  slug: string;
  from_city: string;
  to_city: string;
  train: string;
  price_usd: number;
  duration_hours: number;
  updated_at: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

function rowToTrainTicket(row: TrainTicketRow): TrainTicket {
  return {
    slug: row.slug,
    fromCity: row.from_city,
    toCity: row.to_city,
    train: row.train,
    priceUsd: row.price_usd,
    durationHours: row.duration_hours,
    updatedAt: row.updated_at,
    title: row.title,
    summary: row.summary,
  };
}

export async function getAllTrainTickets(): Promise<TrainTicket[]> {
  const { data, error } = await supabase
    .from("train_tickets")
    .select("*")
    .order("from_city", { ascending: true });

  if (error) {
    console.error("getAllTrainTickets failed:", error.message);
    return [];
  }
  return (data as TrainTicketRow[]).map(rowToTrainTicket);
}

export async function getTrainTicketBySlug(slug: string): Promise<TrainTicket | undefined> {
  const { data, error } = await supabase
    .from("train_tickets")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getTrainTicketBySlug failed:", error.message);
    return undefined;
  }
  return rowToTrainTicket(data as TrainTicketRow);
}
