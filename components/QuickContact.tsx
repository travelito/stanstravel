"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { phone, whatsappNumber, telegramUsername } from "@/lib/contact";
import { WhatsAppIcon, TelegramIcon } from "@/components/BrandIcons";

function CallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function QuickContact({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const message = t(locale, "quickContactMessage");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const telegramHref = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  const links = [
    { href: telegramHref, label: t(locale, "quickContactTelegram"), bg: "bg-[#229ED9]", icon: <TelegramIcon /> },
    { href: whatsappHref, label: t(locale, "quickContactWhatsapp"), bg: "bg-[#25D366]", icon: <WhatsAppIcon /> },
    { href: telHref, label: t(locale, "quickContactCall"), bg: "bg-ink", icon: <CallIcon /> },
  ];

  return (
    <>
      {/* Desktop / tablet — always-expanded stack */}
      <div className="hidden sm:flex flex-col gap-3 fixed z-30 bottom-6 right-6">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("tel:") ? undefined : "_blank"}
            rel={l.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
            aria-label={l.label}
            title={l.label}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 ${l.bg}`}
          >
            {l.icon}
          </a>
        ))}
      </div>

      {/* Mobile — collapsible FAB */}
      <div
        className="sm:hidden fixed z-30 right-4 flex flex-col items-end gap-3"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        {links.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("tel:") ? undefined : "_blank"}
            rel={l.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
            aria-label={l.label}
            title={l.label}
            tabIndex={open ? 0 : -1}
            className={`flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all duration-200 ${l.bg} ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            {l.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t(locale, "quickContactToggle")}
          aria-expanded={open}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo shadow-lg"
        >
          <span className={`inline-flex transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
            <PlusIcon />
          </span>
        </button>
      </div>
    </>
  );
}
