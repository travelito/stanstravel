import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllExcursions, getExcursionBySlug } from "@/lib/data/excursions";
import { ListingImage } from "@/components/ListingImage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ShareButton } from "@/components/ShareButton";
import { BookingForm } from "@/components/BookingForm";

export async function generateStaticParams() {
  const excursions = await getAllExcursions();
  return locales.flatMap((locale) => excursions.map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const excursion = await getExcursionBySlug(params.slug);
  if (!excursion) return {};
  return {
    title: `${excursion.title[locale]} — ${t(locale, "siteName")}`,
    description: excursion.summary[locale],
    alternates: { canonical: `/${locale}/excursions/${excursion.slug}` },
    openGraph: {
      title: excursion.title[locale],
      description: excursion.summary[locale],
      images: excursion.photos[0] ? [excursion.photos[0].full] : [],
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
  };
}

export default async function ExcursionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const excursion = await getExcursionBySlug(params.slug);
  if (!excursion) notFound();

  return (
    <article className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/excursions`} className="hover:text-turquoise">
          {t(locale, "navExcursions")}
        </Link>{" "}
        / {excursion!.title[locale]}
      </nav>

      <div className="flex flex-col">
        <div className="order-2 mt-6 flex items-start justify-between gap-4 sm:order-1 sm:mt-0">
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-wide text-turquoise">
              {excursion!.city}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-ink mt-1">
              {excursion!.title[locale]}
            </h1>
            <p className="mt-3 font-mono text-sm text-ink/60">
              {t(locale, "duration")}: {excursion!.durationHours} {t(locale, "hours")}
            </p>
          </div>
          <ShareButton label={t(locale, "share")} locale={locale} />
        </div>

        <div className="order-1 sm:order-2 sm:mt-6">
          {excursion!.photos.length > 0 ? (
            <PhotoGallery photos={excursion!.photos} alt={excursion!.title[locale]} locale={locale} />
          ) : (
            <div className="relative h-[75vh] w-[calc(100%+3rem)] -mx-6 sm:h-[420px] sm:w-full sm:mx-0 rounded-none sm:rounded-xl overflow-hidden">
              <ListingImage
                src={null}
                alt={excursion!.title[locale]}
                sizes="(max-width: 640px) 100vw, 66vw"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 text-ink/90 leading-relaxed">
          <p>{excursion!.summary[locale]}</p>
        </div>

        <aside className="lg:order-last">
          <div className="lg:sticky lg:top-24">
            <BookingForm
              title={excursion!.title[locale]}
              kindLabel={t(locale, "bookingLabelExcursion")}
              priceUsd={excursion!.priceUsd}
              locale={locale}
            />
          </div>
        </aside>
      </div>

      <Link
        href={`/${locale}/excursions`}
        className="inline-block mt-10 text-turquoise hover:text-indigo font-mono text-sm"
      >
        ← {t(locale, "backToExcursions")}
      </Link>
    </article>
  );
}
