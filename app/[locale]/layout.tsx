import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { locales, isLocale, type Locale } from "@/lib/locales";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickContact } from "@/components/QuickContact";
import "@/app/globals.css";

const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const siteUrl = "https://www.stanstravel.com";
  return {
    metadataBase: new URL(siteUrl),
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G6BE7BDK9W"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G6BE7BDK9W');
          `}
        </Script>
        {yandexMetrikaId && (
          <>
            <Script id="yandex-metrika" strategy="afterInteractive">
              {`
                (function(m,e,t,r,i,k,a){
                    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(${yandexMetrikaId}, "init", {
                    ssr:true,
                    webvisor:true,
                    clickmap:true,
                    ecommerce:"dataLayer"
                });
              `}
            </Script>
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                  style={{ position: "absolute", left: "-9999px" }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <QuickContact locale={locale} />
      </body>
    </html>
  );
}
