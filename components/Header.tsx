import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShareButton } from "@/components/ShareButton";

export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-display text-xl tracking-tight">
          {t(locale, "siteName")}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
          <Link href={`/${locale}/tours`} className="hover:text-turquoise">
            {t(locale, "navTours")}
          </Link>
          <Link href={`/${locale}/excursions`} className="hover:text-turquoise">
            {t(locale, "navExcursions")}
          </Link>
          <Link href={`/${locale}/transfers`} className="hover:text-turquoise">
            {t(locale, "navTransfers")}
          </Link>
          <Link href={`/${locale}/train-tickets`} className="hover:text-turquoise">
            {t(locale, "navTrainTickets")}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-turquoise">
            {t(locale, "navAbout")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ShareButton label={t(locale, "share")} />
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}
