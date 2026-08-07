import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllTours } from "@/lib/data/tours";
import { TourCard } from "@/components/TourCard";
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
    title: `${t(locale, "toursTitle")} — ${t(locale, "siteName")}`,
    description: t(locale, "heroSubtitle"),
    alternates: { canonical: `/${locale}/tours` },
  };
}

export default function ToursPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const tours = getAllTours();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <a href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </a>{" "}
        / {t(locale, "toursTitle")}
      </nav>
      <h1 className="font-display text-3xl mb-8">{t(locale, "toursTitle")}</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} locale={locale} />
        ))}
      </div>
    </div>
  );
}
