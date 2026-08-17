import type { Locale } from "@/lib/locales";

export type Duration = { value: number; unit: "hours" | "days" };

const wordsRu: Record<"hours" | "days", [string, string, string]> = {
  hours: ["час", "часа", "часов"],
  days: ["день", "дня", "дней"],
};

function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function formatDuration(d: Duration, locale: Locale): string {
  if (locale === "ru") {
    return `${d.value} ${pluralRu(d.value, wordsRu[d.unit])}`;
  }
  const unit = d.unit === "hours" ? "h" : d.value === 1 ? "day" : "days";
  return `${d.value} ${unit}`;
}

// Full-word hour duration for card captions (e.g. "6 часов" / "6 hours"),
// as opposed to the abbreviated "hours" dictionary key used in compact spots.
export function formatHours(hours: number, locale: Locale): string {
  if (locale === "ru") {
    const word = Number.isInteger(hours) ? pluralRu(hours, wordsRu.hours) : wordsRu.hours[2];
    return `${hours} ${word}`;
  }
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}
