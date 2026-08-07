import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllExcursions } from "@/lib/data/excursions";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return {
    title: `${t(locale, "excursionsTitle")} — ${t(locale, "siteName")}`,
    alternates: { canonical: `/${locale}/excursions` },
  };
}

export default function ExcursionsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const excursions = getAllExcursions();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <a href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </a>{" "}
        / {t(locale, "excursionsTitle")}
      </nav>
      <h1 className="font-display text-3xl mb-8">{t(locale, "excursionsTitle")}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {excursions.map((ex) => (
          <div key={ex.slug} className="border border-ink/10 rounded-lg p-5 bg-white/40">
            <p className="font-mono text-xs text-turquoise uppercase tracking-wide">{ex.city}</p>
            <h2 className="font-display text-lg mt-1">{ex.title[locale]}</h2>
            <p className="text-sm text-ink/70 mt-2">{ex.summary[locale]}</p>
            <div className="flex justify-between mt-4 font-mono text-sm">
              <span>
                {ex.durationHours} {t(locale, "hours")}
              </span>
              <span className="text-indigo font-semibold">
                {t(locale, "fromPrice")} ${ex.priceUsd}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
