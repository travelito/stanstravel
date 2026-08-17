import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { phone, whatsappNumber, telegramUsername } from "@/lib/contact";
import { WhatsAppIcon, TelegramIcon } from "@/components/BrandIcons";

function CallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.79.65 2.65a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.43-1.42a2 2 0 0 1 2.11-.45c.86.31 1.75.53 2.65.65A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function QuickContact({ locale }: { locale: Locale }) {
  const message = t(locale, "quickContactMessage");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const telegramHref = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  const links = [
    { href: telegramHref, label: t(locale, "quickContactTelegram"), bg: "bg-[#229ED9]", icon: <TelegramIcon size={19} /> },
    { href: whatsappHref, label: t(locale, "quickContactWhatsapp"), bg: "bg-[#25D366]", icon: <WhatsAppIcon size={19} /> },
    { href: telHref, label: t(locale, "quickContactCall"), bg: "bg-ink", icon: <CallIcon /> },
  ];

  return (
    <div
      className="fixed z-30 right-4 sm:right-6 flex flex-col gap-2 sm:gap-3"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith("tel:") ? undefined : "_blank"}
          rel={l.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
          aria-label={l.label}
          title={l.label}
          className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-transform hover:scale-105 ${l.bg}`}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
