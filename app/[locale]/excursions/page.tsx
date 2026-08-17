import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { cityLabel } from "@/lib/cities";
import { getAllExcursions } from "@/lib/data/excursions";
import { ExcursionCard } from "@/components/ExcursionCard";
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

export default async function ExcursionsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { city?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const allExcursions = await getAllExcursions();

  const requestedCity = searchParams.city;
  const cityIsValid = Boolean(requestedCity && allExcursions.some((e) => e.city === requestedCity));
  const activeCity = cityIsValid ? requestedCity! : null;
  const excursions = activeCity
    ? allExcursions.filter((e) => e.city === activeCity)
    : allExcursions;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <a href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </a>{" "}
        / {t(locale, "excursionsTitle")}
      </nav>
      <h1 className={`font-display text-3xl ${activeCity ? "mb-2" : "mb-8"}`}>
        {t(locale, "excursionsTitle")}
      </h1>
      {activeCity && (
        <p className="mb-8 font-mono text-sm text-ink/50">
          {t(locale, "filteredByCity")}: {cityLabel(activeCity, locale)} ·{" "}
          <Link href={`/${locale}/excursions`} className="text-turquoise hover:text-indigo">
            {t(locale, "showAll")}
          </Link>
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {excursions.map((excursion) => (
          <ExcursionCard key={excursion.slug} excursion={excursion} locale={locale} />
        ))}
      </div>
    </div>
  );
}
