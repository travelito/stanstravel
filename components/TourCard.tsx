import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { formatDuration } from "@/lib/duration";
import type { Tour } from "@/lib/data/tours";

export function TourCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/tours/${tour.slug}`}
      className="group block rounded-lg overflow-hidden border border-ink/10 bg-white/40 hover:border-turquoise transition-colors"
    >
      <div className="relative h-48 w-full">
        <Image
          src={tour.image}
          alt={tour.title[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <p className="font-mono text-xs text-turquoise uppercase tracking-wide">{tour.city}</p>
        <h3 className="font-display text-lg mt-1 group-hover:text-indigo">{tour.title[locale]}</h3>
        <p className="text-sm text-ink/70 mt-2">{tour.summary[locale]}</p>
        <div className="flex items-center justify-between mt-4 font-mono text-sm">
          <span>{formatDuration(tour.duration, locale)}</span>
          <span className="text-indigo font-semibold">
            {t(locale, "fromPrice")} ${tour.priceUsd}
          </span>
        </div>
      </div>
    </Link>
  );
}
