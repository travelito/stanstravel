import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/locales";

// Next.js does not merge `alternates` between a layout and a page — whichever
// segment sets it last wins outright. Since every page sets its own
// `alternates.canonical`, that silently wiped the hreflang tags the root
// locale layout used to provide. Building both canonical and hreflang here,
// per page, keeps them from ever going missing again.
export function localizedAlternates(suffix: string, currentLocale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `/${locale}${suffix}`;
  }
  return {
    canonical: `/${currentLocale}${suffix}`,
    languages: { ...languages, "x-default": `/ru${suffix}` },
  };
}
