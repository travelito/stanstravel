import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllExcursions, getExcursionBySlug } from "@/lib/data/excursions";

export function generateStaticParams() {
  const excursions = getAllExcursions();
  return locales.flatMap((locale) => excursions.map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const excursion = getExcursionBySlug(params.slug);
  if (!excursion) return {};
  return {
    title: `${excursion.title[locale]} — ${t(locale, "siteName")}`,
    description: excursion.summary[locale],
    alternates: { canonical: `/${locale}/excursions/${excursion.slug}` },
  };
}

export default function ExcursionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const excursion = getExcursionBySlug(params.slug);
  if (!excursion) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
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
      <p className="font-mono text-xs text-turquoise uppercase tracking-wide">
        {excursion!.city}
      </p>
      <h1 className="font-display text-3xl mt-2">{excursion!.title[locale]}</h1>
      <p className="mt-6 text-ink/90 leading-relaxed">{excursion!.summary[locale]}</p>
      <div className="flex gap-6 mt-6 font-mono text-sm text-ink/70">
        <span>
          {t(locale, "duration")}: {excursion!.durationHours} {t(locale, "hours")}
        </span>
        <span className="text-indigo font-semibold">
          {t(locale, "fromPrice")} ${excursion!.priceUsd}
        </span>
      </div>
      <Link
        href={`/${locale}/excursions`}
        className="inline-block mt-10 text-turquoise hover:text-indigo font-mono text-sm"
      >
        ← {t(locale, "backToTours")}
      </Link>
    </article>
  );
}
