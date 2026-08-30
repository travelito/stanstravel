import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { cityLabel } from "@/lib/cities";
import { localizedAlternates } from "@/lib/seo";
import { getAllExcursions, groupExcursionsByCity } from "@/lib/data/excursions";
import { ExcursionCard } from "@/components/ExcursionCard";
import { CityFilterTabs } from "@/components/CityFilterTabs";
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
    alternates: localizedAlternates("/excursions", locale),
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
  const grouped = groupExcursionsByCity(allExcursions, locale);
  const cityOrder = grouped.map(([city]) => city);

  const requestedCity = searchParams.city;
  const activeCity = requestedCity && cityOrder.includes(requestedCity) ? requestedCity : null;
  const sections = activeCity ? grouped.filter(([city]) => city === activeCity) : grouped;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <a href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </a>{" "}
        / {t(locale, "excursionsTitle")}
      </nav>
      <h1 className="font-display text-3xl mb-8">{t(locale, "excursionsTitle")}</h1>

      <CityFilterTabs
        cities={cityOrder}
        activeCity={activeCity}
        locale={locale}
        basePath={`/${locale}/excursions`}
      />

      {sections.map(([city, items], sectionIndex) => (
        <div key={city} className="mb-14">
          <h2 className="font-display text-2xl mb-6">{cityLabel(city, locale)}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((excursion, itemIndex) => (
              <ExcursionCard
                key={excursion.slug}
                excursion={excursion}
                locale={locale}
                priority={sectionIndex === 0 && itemIndex === 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
