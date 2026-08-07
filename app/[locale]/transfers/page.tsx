import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllTransfers } from "@/lib/data/transfers";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return {
    title: `${t(locale, "transfersTitle")} — ${t(locale, "siteName")}`,
    alternates: { canonical: `/${locale}/transfers` },
  };
}

export default function TransfersPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const transfers = getAllTransfers();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        / {t(locale, "transfersTitle")}
      </nav>
      <h1 className="font-display text-3xl mb-8">{t(locale, "transfersTitle")}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {transfers.map((tr) => (
          <Link
            key={tr.slug}
            href={`/${locale}/transfers/${tr.slug}`}
            className="block border border-ink/10 rounded-lg p-5 bg-white/40 hover:border-turquoise transition-colors"
          >
            <p className="font-mono text-xs text-turquoise uppercase tracking-wide">
              {tr.fromCity} → {tr.toCity}
            </p>
            <h2 className="font-display text-lg mt-1">{tr.title[locale]}</h2>
            <p className="text-sm text-ink/70 mt-2">{tr.summary[locale]}</p>
            <div className="flex justify-between mt-4 font-mono text-sm">
              <span>
                {tr.durationHours} {t(locale, "hours")}
              </span>
              <span className="text-indigo font-semibold">
                {t(locale, "fromPrice")} ${tr.priceUsd}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
