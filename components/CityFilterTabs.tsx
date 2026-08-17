import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { cityLabel } from "@/lib/cities";

const tabClass = (active: boolean) =>
  `inline-flex items-center rounded-full px-4 py-2 font-mono text-sm whitespace-nowrap transition-colors ${
    active
      ? "bg-indigo text-plaster"
      : "border border-ink/15 text-ink/60 hover:border-turquoise hover:text-turquoise"
  }`;

export function CityFilterTabs({
  cities,
  activeCity,
  locale,
  basePath,
}: {
  cities: string[];
  activeCity: string | null;
  locale: Locale;
  basePath: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <Link href={basePath} className={tabClass(activeCity === null)}>
        {t(locale, "excursionsAllCities")}
      </Link>
      {cities.map((city) => (
        <Link key={city} href={`${basePath}?city=${city}`} className={tabClass(activeCity === city)}>
          {cityLabel(city, locale)}
        </Link>
      ))}
    </div>
  );
}
