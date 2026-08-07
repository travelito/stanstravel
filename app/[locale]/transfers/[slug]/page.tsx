import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllTransfers, getTransferBySlug } from "@/lib/data/transfers";

export function generateStaticParams() {
  const transfers = getAllTransfers();
  return locales.flatMap((locale) => transfers.map((tr) => ({ locale, slug: tr.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const transfer = getTransferBySlug(params.slug);
  if (!transfer) return {};
  return {
    title: `${transfer.title[locale]} — ${t(locale, "siteName")}`,
    description: transfer.summary[locale],
    alternates: { canonical: `/${locale}/transfers/${transfer.slug}` },
  };
}

export default function TransferDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const transfer = getTransferBySlug(params.slug);
  if (!transfer) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/transfers`} className="hover:text-turquoise">
          {t(locale, "navTransfers")}
        </Link>{" "}
        / {transfer!.title[locale]}
      </nav>
      <p className="font-mono text-xs text-turquoise uppercase tracking-wide">
        {transfer!.fromCity} → {transfer!.toCity}
      </p>
      <h1 className="font-display text-3xl mt-2">{transfer!.title[locale]}</h1>
      <p className="mt-6 text-ink/90 leading-relaxed">{transfer!.summary[locale]}</p>
      <div className="flex gap-6 mt-6 font-mono text-sm text-ink/70">
        <span>
          {t(locale, "duration")}: {transfer!.durationHours} {t(locale, "hours")}
        </span>
        <span className="text-indigo font-semibold">
          {t(locale, "fromPrice")} ${transfer!.priceUsd}
        </span>
      </div>
      <Link
        href={`/${locale}/transfers`}
        className="inline-block mt-10 text-turquoise hover:text-indigo font-mono text-sm"
      >
        ← {t(locale, "transfersTitle")}
      </Link>
    </article>
  );
}
