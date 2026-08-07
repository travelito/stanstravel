// This file is the single source of truth for tours shown on the site.
// It currently holds static data. To move to Supabase later, replace the
// functions below (getAllTours / getTourBySlug) with queries against a
// `tours` table that has the same fields — every page that calls these
// functions (listing, detail, sitemap) will keep working unchanged.

import type { Locale } from "@/lib/locales";
import type { Duration } from "@/lib/duration";

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

export const tours: Tour[] = [
  {
    slug: "samarkand-registan-day-tour",
    city: "Samarkand",
    duration: { value: 5, unit: "hours" },
    priceUsd: 85,
    updatedAt: "2026-07-20",
    title: {
      ru: "Самарканд: Регистан и жемчужины Шёлкового пути",
      en: "Samarkand: Registan and the Silk Road Pearls",
    },
    summary: {
      ru: "Однодневная экскурсия по главным памятникам Самарканда с гидом.",
      en: "A full-day guided tour of Samarkand's landmark monuments.",
    },
    description: {
      ru: [
        "Самарканд — один из старейших городов мира и сердце Шёлкового пути. За один день вы увидите площадь Регистан с тремя медресе, мавзолей Гур-Эмир и некрополь Шахи-Зинда.",
        "Маршрут выстроен так, чтобы застать Регистан в лучшем освещении и избежать основного потока туристических групп.",
      ],
      en: [
        "Samarkand is one of the oldest cities in the world and the heart of the Silk Road. In a single day you'll see Registan Square with its three madrasahs, the Gur-Emir mausoleum, and the Shah-i-Zinda necropolis.",
        "The route is timed to catch Registan in the best light and avoid the main tour-group crowds.",
      ],
    },
    highlights: {
      ru: ["Площадь Регистан", "Мавзолей Гур-Эмир", "Шахи-Зинда", "Гид на русском или английском"],
      en: ["Registan Square", "Gur-Emir Mausoleum", "Shah-i-Zinda", "Russian or English speaking guide"],
    },
    image: "https://images.unsplash.com/photo-1621789098261-4436a3c98c0d?q=80&w=1200",
  },
  {
    slug: "bukhara-old-city-tour",
    city: "Bukhara",
    duration: { value: 2, unit: "days" },
    priceUsd: 90,
    updatedAt: "2026-07-18",
    title: {
      ru: "Бухара: старый город и торговые купола",
      en: "Bukhara: Old Town and the Trading Domes",
    },
    summary: {
      ru: "Прогулка по историческому центру Бухары с посещением цитадели Арк.",
      en: "A walk through Bukhara's historic center, including the Ark citadel.",
    },
    description: {
      ru: [
        "Старый город Бухары — единственный в Центральной Азии, сохранивший цельную средневековую застройку. Вы пройдёте от цитадели Арк через торговые купола до минарета Калян.",
        "По пути — остановки у мастерских ремесленников, где до сих пор работают потомственные ткачи и чеканщики.",
      ],
      en: [
        "Bukhara's old town is the only one in Central Asia to preserve its medieval layout intact. The route runs from the Ark citadel through the trading domes to the Kalyan minaret.",
        "Along the way you'll stop at workshops where artisan families still weave and engrave using traditional techniques.",
      ],
    },
    highlights: {
      ru: ["Цитадель Арк", "Торговые купола", "Минарет Калян", "Мастерские ремесленников"],
      en: ["Ark Citadel", "Trading Domes", "Kalyan Minaret", "Artisan workshops"],
    },
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200",
  },
  {
    slug: "khiva-ichan-kala-tour",
    city: "Khiva",
    duration: { value: 3, unit: "days" },
    priceUsd: 75,
    updatedAt: "2026-07-15",
    title: {
      ru: "Хива: город-музей Ичан-Кала",
      en: "Khiva: The Ichan-Kala Open-Air Museum",
    },
    summary: {
      ru: "Экскурсия по внутреннему городу Хивы, целиком включённому в список ЮНЕСКО.",
      en: "A guided walk through Khiva's inner city, fully UNESCO-listed.",
    },
    description: {
      ru: [
        "Ичан-Кала — единственный в Узбекистане город, чей исторический центр целиком заключён в крепостную стену и превращён в открытый музей.",
        "Вы подниметесь на смотровую площадку крепости Куня-Арк с видом на весь старый город.",
      ],
      en: [
        "Ichan-Kala is the only historic center in Uzbekistan fully enclosed within its original city walls and preserved as a living open-air museum.",
        "You'll climb to the Kunya-Ark watchtower for a panoramic view over the entire old town.",
      ],
    },
    highlights: {
      ru: ["Крепостные стены Ичан-Калы", "Минарет Кальта-Минор", "Крепость Куня-Арк", "Дворец Таш-Хаули"],
      en: ["Ichan-Kala city walls", "Kalta Minor minaret", "Kunya-Ark fortress", "Tash-Khauli Palace"],
    },
    image: "https://images.unsplash.com/photo-1596395819057-e34ea1f2e2c0?q=80&w=1200",
  },
];

export function getAllTours(): Tour[] {
  return tours;
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
