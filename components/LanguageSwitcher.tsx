"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  // Strip the leading /<locale> segment so we can rebuild the path for the other locale.
  const path = pathname.replace(/^\/[a-z]{2}/, "");
  return (
    <div className="flex items-center gap-1 text-sm font-mono" aria-label="Language switcher">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink/30">/</span>}
          <Link
            href={`/${locale}${path}`}
            aria-current={locale === currentLocale ? "true" : undefined}
            className={
              locale === currentLocale
                ? "text-indigo font-semibold"
                : "text-ink/50 hover:text-ink"
            }
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
