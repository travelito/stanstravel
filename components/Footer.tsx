import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";

const phone = "+998 99 015 21 10";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-ink/60">
        <span className="font-display text-base text-ink">{t(locale, "siteName")}</span>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-mono hover:text-turquoise">
          {phone}
        </a>
        <span>
          © {new Date().getFullYear()} {t(locale, "siteName")}. {t(locale, "footerRights")}
        </span>
      </div>
    </footer>
  );
}
