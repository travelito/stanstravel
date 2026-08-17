import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import { phone, whatsappNumber } from "@/lib/contact";

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
    title: `${t(locale, "aboutTitle")} — ${t(locale, "siteName")}`,
    description: t(locale, "aboutIntro"),
    alternates: { canonical: `/${locale}/about` },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const reasons = [
    { title: t(locale, "aboutReason1Title"), body: t(locale, "aboutReason1Body") },
    { title: t(locale, "aboutReason2Title"), body: t(locale, "aboutReason2Body") },
    { title: t(locale, "aboutReason3Title"), body: t(locale, "aboutReason3Body") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <nav aria-label="breadcrumb" className="text-sm text-ink/50 mb-6 font-mono">
        <Link href={`/${locale}`} className="hover:text-turquoise">
          {t(locale, "navHome")}
        </Link>{" "}
        / {t(locale, "aboutTitle")}
      </nav>

      <h1 className="font-display text-3xl mb-4">{t(locale, "aboutTitle")}</h1>
      <p className="text-ink/80 leading-relaxed mb-10">{t(locale, "aboutIntro")}</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-14">
        {reasons.map((r, i) => (
          <div key={i} className="border border-ink/10 rounded-lg p-5 bg-white/40">
            <p className="font-mono text-xs text-turquoise mb-2">0{i + 1}</p>
            <h2 className="font-display text-lg mb-2">{r.title}</h2>
            <p className="text-sm text-ink/70">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-ink/10 pt-8">
        <h2 className="font-display text-xl mb-4">{t(locale, "contactsTitle")}</h2>
        <p className="font-mono text-sm mb-2">
          {t(locale, "contactsPhone")}:{" "}
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-indigo hover:text-turquoise">
            {phone}
          </a>
        </p>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          className="inline-block mt-2 bg-indigo text-plaster px-5 py-2.5 rounded-md font-body text-sm hover:bg-turquoise transition-colors"
        >
          {t(locale, "contactsWhatsapp")}
        </a>
      </div>
    </div>
  );
}
