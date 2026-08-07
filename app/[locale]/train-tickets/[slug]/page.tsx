import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { getAllTrainTickets, getTrainTicketBySlug } from "@/lib/data/train-tickets";

export function generateStaticParams() {
  const tickets = getAllTrainTickets();
  return locales.flatMap((locale) => tickets.map((tt) => ({ locale, slug: tt.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const ticket = getTrainTicketBySlug(params.slug);
  if (!ticket) return {};
  return {
    title: `${ticket.title[locale]} — ${t(locale, "siteName")}`,
    description: ticket.summary[locale],
    alternates: { canonical: `/${locale}/train-tickets/${ticket.slug}` },
  };
}

export default function TrainTicketDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ticket = getTrainTicketBySlug(params.slug);
  if (!ticket) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TrainTrip",
    name: ticket!.title[locale],
    provider: { "@type": "Organization", name: ticket!.train },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/train-tickets`} className="hover:text-turquoise">
          {t(locale, "navTrainTickets")}
        </Link>{" "}
        / {ticket!.title[locale]}
      </nav>
      <p className="font-mono text-xs text-turquoise uppercase tracking-wide">
        {ticket!.fromCity} → {ticket!.toCity} · {ticket!.train}
      </p>
      <h1 className="font-display text-3xl mt-2">{ticket!.title[locale]}</h1>
      <p className="mt-6 text-ink/90 leading-relaxed">{ticket!.summary[locale]}</p>
      <div className="flex gap-6 mt-6 font-mono text-sm text-ink/70">
        <span>
          {t(locale, "duration")}: {ticket!.durationHours} {t(locale, "hours")}
        </span>
        <span className="text-indigo font-semibold">
          {t(locale, "fromPrice")} ${ticket!.priceUsd}
        </span>
      </div>
      <Link
        href={`/${locale}/train-tickets`}
        className="inline-block mt-10 text-turquoise hover:text-indigo font-mono text-sm"
      >
        ← {t(locale, "trainTicketsTitle")}
      </Link>
    </article>
  );
}
