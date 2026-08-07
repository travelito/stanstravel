import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/locales";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const siteUrl = "https://example-karvon.com"; // TODO: replace with real domain
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${siteUrl}/${l}`;
  });
  return {
    metadataBase: new URL(siteUrl),
    alternates: {
      languages: { ...languages, "x-default": `${siteUrl}/ru` },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <html lang={locale}>
      <body className="font-body min-h-screen flex flex-col">
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
