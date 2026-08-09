import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { formatDuration } from "@/lib/duration";
import { getAllTours, getTourBySlug } from "@/lib/data/tours";
import { ListingImage } from "@/components/ListingImage";
import { PhotoGallery } from "@/components/PhotoGallery";

export async function generateStaticParams() {
  const tours = await getAllTours();
  return locales.flatMap((locale) => tours.map((tour) => ({ locale, slug: tour.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const tour = await getTourBySlug(params.slug);
  if (!tour) return {};
  return {
    title: `${tour.title[locale]} — ${t(locale, "siteName")}`,
    description: tour.summary[locale],
    alternates: { canonical: `/${locale}/tours/${tour.slug}` },
    openGraph: {
      title: tour.title[locale],
      description: tour.summary[locale],
      images: tour.photos[0] ? [tour.photos[0].full] : [],
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const tour = await getTourBySlug(params.slug);
  if (!tour) notFound(); // real 404 — no fallback to homepage content

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour!.title[locale],
    description: tour!.summary[locale],
    touristType: "Sightseeing",
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/tours`} className="hover:text-turquoise">
          {t(locale, "navTours")}
        </Link>{" "}
        / {tour!.title[locale]}
      </nav>

      <p className="font-mono text-xs text-turquoise uppercase tracking-wide">{tour!.city}</p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">{tour!.title[locale]}</h1>

      <div className="mt-6">
        {tour!.photos.length > 0 ? (
          <PhotoGallery photos={tour!.photos} alt={tour!.title[locale]} />
        ) : (
          <div className="relative h-72 w-full rounded-lg overflow-hidden">
            <ListingImage src={null} alt={tour!.title[locale]} sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}
      </div>

      <div className="flex gap-6 mt-6 font-mono text-sm text-ink/70">
        <span>
          {t(locale, "duration")}: {formatDuration(tour!.duration, locale)}
        </span>
        <span className="text-indigo font-semibold">
          {t(locale, "fromPrice")} ${tour!.priceUsd} {t(locale, "perPerson")}
        </span>
      </div>

      <div className="mt-8 space-y-4 text-ink/90 leading-relaxed">
        {tour!.description[locale].map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h2 className="font-display text-xl mt-10 mb-3">{t(locale, "highlights")}</h2>
      <ul className="list-disc list-inside space-y-1 text-ink/80">
        {tour!.highlights[locale].map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <Link
        href={`/${locale}/tours`}
        className="inline-block mt-10 text-turquoise hover:text-indigo font-mono text-sm"
      >
        ← {t(locale, "backToTours")}
      </Link>
    </article>
  );
}
