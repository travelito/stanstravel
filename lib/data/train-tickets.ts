import type { Locale } from "@/lib/locales";

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

export const trainTickets: TrainTicket[] = [
  {
    slug: "tashkent-to-samarkand-train",
    fromCity: "Tashkent",
    toCity: "Samarkand",
    train: "Afrosiyob",
    priceUsd: 18,
    durationHours: 2,
    updatedAt: "2026-07-28",
    title: {
      ru: "Билет на поезд Ташкент — Самарканд",
      en: "Train Ticket: Tashkent to Samarkand",
    },
    summary: {
      ru: "Скоростной поезд Afrosiyob, около 2 часов в пути.",
      en: "High-speed Afrosiyob train, about 2 hours travel time.",
    },
  },
  {
    slug: "samarkand-to-bukhara-train",
    fromCity: "Samarkand",
    toCity: "Bukhara",
    train: "Afrosiyob",
    priceUsd: 12,
    durationHours: 1.5,
    updatedAt: "2026-07-28",
    title: {
      ru: "Билет на поезд Самарканд — Бухара",
      en: "Train Ticket: Samarkand to Bukhara",
    },
    summary: {
      ru: "Скоростной поезд Afrosiyob, около полутора часов в пути.",
      en: "High-speed Afrosiyob train, about ninety minutes travel time.",
    },
  },
  {
    slug: "tashkent-to-bukhara-train",
    fromCity: "Tashkent",
    toCity: "Bukhara",
    train: "Afrosiyob",
    priceUsd: 25,
    durationHours: 4,
    updatedAt: "2026-07-28",
    title: {
      ru: "Билет на поезд Ташкент — Бухара",
      en: "Train Ticket: Tashkent to Bukhara",
    },
    summary: {
      ru: "Прямой скоростной поезд Afrosiyob без пересадок.",
      en: "A direct high-speed Afrosiyob train with no changes.",
    },
  },
];

export function getAllTrainTickets(): TrainTicket[] {
  return trainTickets;
}

export function getTrainTicketBySlug(slug: string): TrainTicket | undefined {
  return trainTickets.find((tt) => tt.slug === slug);
}
