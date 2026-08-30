import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { formatHours } from "@/lib/duration";
import type { Excursion } from "@/lib/data/excursions";
import { ListingCard } from "@/components/ListingCard";

export function ExcursionCard({
  excursion,
  locale,
  priority,
}: {
  excursion: Excursion;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <ListingCard
      href={`/${locale}/excursions/${excursion.slug}`}
      photos={excursion.photos}
      imageAlt={excursion.title[locale]}
      eyebrow={excursion.city}
      title={excursion.title[locale]}
      duration={formatHours(excursion.durationHours, locale)}
      fromLabel={t(locale, "fromPrice")}
      price={excursion.priceUsd}
      priority={priority}
    />
  );
}
