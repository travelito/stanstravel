import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import type { Excursion } from "@/lib/data/excursions";
import { ListingCard } from "@/components/ListingCard";

export function ExcursionCard({ excursion, locale }: { excursion: Excursion; locale: Locale }) {
  return (
    <ListingCard
      href={`/${locale}/excursions/${excursion.slug}`}
      photos={excursion.photos}
      imageAlt={excursion.title[locale]}
      eyebrow={excursion.city}
      title={excursion.title[locale]}
      duration={`${excursion.durationHours} ${t(locale, "hours")}`}
      fromLabel={t(locale, "fromPrice")}
      price={excursion.priceUsd}
    />
  );
}
