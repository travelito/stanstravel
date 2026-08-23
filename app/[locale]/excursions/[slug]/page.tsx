import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Users, MapPin, Languages, Car, Check, X } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { cityLabel } from "@/lib/cities";
import { formatHours } from "@/lib/duration";
import { localizedAlternates } from "@/lib/seo";
import { getAllExcursions, getExcursionBySlug } from "@/lib/data/excursions";
import { tourPaceQuickInfoItem } from "@/lib/tour-pace";
import { ListingImage } from "@/components/ListingImage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ShareButton } from "@/components/ShareButton";
import { BookingForm } from "@/components/BookingForm";
import { QuickInfoRow, type QuickInfoItem } from "@/components/QuickInfoRow";
import type { PricingConfig } from "@/lib/pricing";

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
    alternates: localizedAlternates(`/excursions/${excursion.slug}`, locale),
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

  const highlights = excursion!.highlights?.[locale] ?? [];
  const itinerary = excursion!.itinerary?.[locale] ?? [];
  const included = excursion!.included?.[locale] ?? [];
  const notIncluded = excursion!.notIncluded?.[locale] ?? [];

  const quickInfoItems: QuickInfoItem[] = [
    { icon: Clock, label: formatHours(excursion!.durationHours, locale) },
    excursion!.tourType
      ? {
          icon: excursion!.tourType === "group" ? Users : User,
          label: t(locale, excursion!.tourType === "group" ? "quickInfoGroupTour" : "quickInfoPrivateTour"),
        }
      : null,
    { icon: MapPin, label: cityLabel(excursion!.city, locale) },
    excursion!.guideLanguage ? { icon: Languages, label: excursion!.guideLanguage } : null,
    excursion!.pickupIncluded === true ? { icon: Car, label: t(locale, "quickInfoPickupIncluded") } : null,
    tourPaceQuickInfoItem(excursion!.tourPace, locale),
  ].filter((item): item is QuickInfoItem => item !== null);

  const pricing: PricingConfig = {
    model: excursion!.pricingModel,
    pricePerPerson: excursion!.priceUsd,
    tiers: excursion!.priceTiers,
  };

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
        <div>
          {excursion!.photos.length > 0 ? (
            <PhotoGallery photos={excursion!.photos} alt={excursion!.title[locale]} locale={locale} />
          ) : (
            <div className="relative h-[70vh] w-full rounded-xl overflow-hidden sm:h-[420px]">
              <ListingImage
                src={null}
                alt={excursion!.title[locale]}
                sizes="(max-width: 640px) 100vw, 66vw"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-semibold uppercase tracking-wide text-turquoise">
                {cityLabel(excursion!.city, locale)}
              </p>
              <h1 className="font-display text-xl sm:text-4xl font-semibold leading-tight text-ink mt-1">
                {excursion!.title[locale]}
              </h1>
            </div>
            <ShareButton label={t(locale, "share")} locale={locale} />
          </div>
          <div className="mt-3">
            <QuickInfoRow items={quickInfoItems} />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 divide-y divide-ink/10">
          <section className="pb-8">
            <h2 className="font-display text-xl font-semibold mb-3">{t(locale, "aboutThisTour")}</h2>
            <p className="text-ink/90 leading-relaxed">{excursion!.summary[locale]}</p>
          </section>

          {highlights.length > 0 && (
            <section className="py-8">
              <h2 className="font-display text-xl font-semibold mb-3">{t(locale, "highlights")}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc list-inside text-ink/80">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {itinerary.length > 0 && (
            <section className="py-8">
              <h2 className="font-display text-xl font-semibold mb-3">{t(locale, "itineraryTitle")}</h2>
              <p className="text-ink/80 leading-relaxed">{itinerary.join(" → ")}</p>
            </section>
          )}

          {(included.length > 0 || notIncluded.length > 0) && (
            <section className="py-8 grid sm:grid-cols-2 gap-8">
              {included.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold mb-3">{t(locale, "includedTitle")}</h2>
                  <ul className="space-y-1.5">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-turquoise" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {notIncluded.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold mb-3">{t(locale, "notIncludedTitle")}</h2>
                  <ul className="space-y-1.5">
                    {notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-ink/60">
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink/40" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="lg:order-last">
          <div className="lg:sticky lg:top-5">
            <BookingForm
              title={excursion!.title[locale]}
              kindLabel={t(locale, "bookingLabelExcursion")}
              pricing={pricing}
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
