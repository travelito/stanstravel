"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { phone, whatsappNumber, telegramUsername } from "@/lib/contact";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.07c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.15-1.53-1.15-2.92 0-1.39.72-2.07.98-2.35.26-.28.56-.35.75-.35.19 0 .37 0 .54.01.17.01.41-.06.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.47-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true">
      <path d="M21.05 3.16 2.98 10.36c-1.24.5-1.23 1.19-.23 1.5l4.63 1.44 1.79 5.48c.22.6.38.84.78.84.4 0 .58-.18.8-.4l1.93-1.87 4.02 2.96c.74.41 1.27.2 1.46-.68l2.65-12.4c.28-1.11-.42-1.6-1.76-1.07ZM8.5 13.75l9.06-5.68c.42-.26.8-.12.49.17l-7.6 6.86-.3 3.1-1.65-4.45Z" />
    </svg>
  );
}

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
    { href: telHref, label: t(locale, "quickContactCall"), bg: "bg-ink", icon: <CallIcon /> },
    { href: telegramHref, label: t(locale, "quickContactTelegram"), bg: "bg-[#229ED9]", icon: <TelegramIcon /> },
    { href: whatsappHref, label: t(locale, "quickContactWhatsapp"), bg: "bg-[#25D366]", icon: <WhatsAppIcon /> },
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
