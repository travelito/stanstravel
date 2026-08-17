import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { formatDuration } from "@/lib/duration";
import type { Tour } from "@/lib/data/tours";
import { ListingCard } from "@/components/ListingCard";

export function TourCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  return (
    <ListingCard
      href={`/${locale}/tours/${tour.slug}`}
      photos={tour.photos}
      imageAlt={tour.title[locale]}
      eyebrow={tour.city}
      title={tour.title[locale]}
      duration={formatDuration(tour.duration, locale)}
      fromLabel={t(locale, "fromPrice")}
      price={tour.priceUsd}
    />
  );
}
