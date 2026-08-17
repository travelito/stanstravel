import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllTours } from "@/lib/data/tours";
import { getAllExcursions, groupExcursionsByCity } from "@/lib/data/excursions";
import { TourCard } from "@/components/TourCard";
import { CityExcursionRow } from "@/components/CityExcursionRow";
import { CityMap } from "@/components/CityMap";
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
    title: `${t(locale, "siteName")} — ${t(locale, "tagline")}`,
    description: t(locale, "heroSubtitle"),
    alternates: { canonical: `/${locale}` },
    openGraph: {
      title: `${t(locale, "siteName")} — ${t(locale, "tagline")}`,
      description: t(locale, "heroSubtitle"),
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const tours = await getAllTours();
  const excursions = await getAllExcursions();

  const excursionsByCity = groupExcursionsByCity(excursions, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: t(locale, "siteName"),
    description: t(locale, "heroSubtitle"),
  };

  return (
    <div className="mx-auto max-w-7xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-10 pb-8 flex flex-col items-center text-center gap-4">
        <h1 className="font-display text-3xl sm:text-4xl max-w-2xl">{t(locale, "heroTitle")}</h1>
        <Link
          href={`/${locale}/tours`}
          className="inline-block bg-indigo text-plaster px-6 py-3 rounded-md font-body hover:bg-turquoise transition-colors"
        >
          {t(locale, "heroCta")}
        </Link>
      </section>

      <section className="py-12">
        <h2 className="font-display text-2xl mb-6">{t(locale, "toursTitle")}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} locale={locale} />
          ))}
        </div>
      </section>

      {excursionsByCity.map(([city, items]) => (
        <CityExcursionRow key={city} city={city} excursions={items.slice(0, 3)} locale={locale} />
      ))}

      <section className="py-12 flex flex-col items-center text-center">
        <h2 className="font-display text-2xl mb-6">
          {locale === "ru" ? "Где мы работаем" : "Where we operate"}
        </h2>
        <CityMap />
      </section>
    </div>
  );
}
