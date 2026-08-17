import type { Locale } from "@/lib/locales";

export const CITY_LABELS: Record<string, { ru: string; ruIn: string; en: string }> = {
  samarkand: { ru: "Самарканд", ruIn: "Самарканде", en: "Samarkand" },
  bukhara: { ru: "Бухара", ruIn: "Бухаре", en: "Bukhara" },
  tashkent: { ru: "Ташкент", ruIn: "Ташкенте", en: "Tashkent" },
  khiva: { ru: "Хива", ruIn: "Хиве", en: "Khiva" },
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function cityLabel(city: string, locale: Locale): string {
  return CITY_LABELS[city]?.[locale] ?? capitalize(city);
}

export function cityLabelIn(city: string, locale: Locale): string {
  const entry = CITY_LABELS[city];
  if (!entry) return capitalize(city);
  return locale === "ru" ? entry.ruIn : entry.en;
}
