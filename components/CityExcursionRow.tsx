import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { cityLabel, cityLabelIn } from "@/lib/cities";
import type { Excursion } from "@/lib/data/excursions";
import { ExcursionCard } from "@/components/ExcursionCard";

export function CityExcursionRow({
  city,
  excursions,
  locale,
}: {
  city: string;
  excursions: Excursion[];
  locale: Locale;
}) {
  return (
    <section className="py-8">
      <div className="flex flex-col gap-1 mb-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-0">
        <h2 className="font-display text-2xl">{cityLabel(city, locale)}</h2>
        <Link
          href={`/${locale}/excursions?city=${city}`}
          className="font-mono text-sm text-turquoise hover:text-indigo whitespace-nowrap"
        >
          {t(locale, "seeAllExcursionsIn")} {cityLabelIn(city, locale)} →
        </Link>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-4">
        {excursions.map((excursion) => (
          <div key={excursion.slug} className="w-64 flex-shrink-0 snap-start sm:w-auto">
            <ExcursionCard excursion={excursion} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  );
}
