import type { Locale } from "@/lib/locales";

export type Transfer = {
  slug: string;
  fromCity: string;
  toCity: string;
  priceUsd: number;
  durationHours: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export const transfers: Transfer[] = [
  {
    slug: "tashkent-to-samarkand-transfer",
    fromCity: "Tashkent",
    toCity: "Samarkand",
    priceUsd: 120,
    durationHours: 4,
    updatedAt: "2026-07-24",
    title: {
      ru: "Трансфер Ташкент — Самарканд",
      en: "Tashkent to Samarkand Transfer",
    },
    summary: {
      ru: "Комфортный частный трансфер или билет на скоростной поезд Afrosiyob.",
      en: "Comfortable private transfer, or a ticket on the Afrosiyob high-speed train.",
    },
  },
  {
    slug: "samarkand-to-bukhara-transfer",
    fromCity: "Samarkand",
    toCity: "Bukhara",
    priceUsd: 100,
    durationHours: 3,
    updatedAt: "2026-07-24",
    title: {
      ru: "Трансфер Самарканд — Бухара",
      en: "Samarkand to Bukhara Transfer",
    },
    summary: {
      ru: "Прямой трансфер между городами без пересадок.",
      en: "A direct transfer between the two cities with no changes.",
    },
  },
];

export function getAllTransfers(): Transfer[] {
  return transfers;
}

export function getTransferBySlug(slug: string): Transfer | undefined {
  return transfers.find((t) => t.slug === slug);
}
