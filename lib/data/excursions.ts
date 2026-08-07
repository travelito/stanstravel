import type { Locale } from "@/lib/locales";

export type Excursion = {
  slug: string;
  city: string;
  durationHours: number;
  priceUsd: number;
  updatedAt: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export const excursions: Excursion[] = [
  {
    slug: "samarkand-evening-walk",
    city: "Samarkand",
    durationHours: 2,
    priceUsd: 35,
    updatedAt: "2026-07-22",
    title: {
      ru: "Вечерняя прогулка по Регистану с подсветкой",
      en: "Evening Walk at Registan with Illumination",
    },
    summary: {
      ru: "Короткая экскурсия к вечерней подсветке площади Регистан.",
      en: "A short excursion to see Registan Square lit up at night.",
    },
  },
  {
    slug: "bukhara-craftsmen-walk",
    city: "Bukhara",
    durationHours: 3,
    priceUsd: 40,
    updatedAt: "2026-07-19",
    title: {
      ru: "Ремесленная Бухара: ткачи, чеканщики, кузнецы",
      en: "Artisan Bukhara: Weavers, Engravers, Blacksmiths",
    },
    summary: {
      ru: "Визит в действующие мастерские старого города.",
      en: "A visit to working artisan workshops in the old town.",
    },
  },
];

export function getAllExcursions(): Excursion[] {
  return excursions;
}

export function getExcursionBySlug(slug: string): Excursion | undefined {
  return excursions.find((e) => e.slug === slug);
}
