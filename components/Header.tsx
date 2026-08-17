import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShareButton } from "@/components/ShareButton";
import { MobileNav } from "@/components/MobileNav";

export function Header({ locale }: { locale: Locale }) {
  const navLinks = [
    { href: `/${locale}/tours`, label: t(locale, "navTours") },
    { href: `/${locale}/excursions`, label: t(locale, "navExcursions") },
    { href: `/${locale}/transfers`, label: t(locale, "navTransfers") },
    { href: `/${locale}/train-tickets`, label: t(locale, "navTrainTickets") },
    { href: `/${locale}/about`, label: t(locale, "navAbout") },
  ];

  return (
    <header className="relative z-50 border-b border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-display text-xl tracking-tight">
          {t(locale, "siteName")}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-turquoise">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ShareButton label={t(locale, "share")} locale={locale} />
          <LanguageSwitcher currentLocale={locale} />
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
