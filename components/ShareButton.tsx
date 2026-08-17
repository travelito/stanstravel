"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { WhatsAppIcon, TelegramIcon } from "@/components/BrandIcons";

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

export function ShareButton({ label, locale }: { label: string; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — do nothing
      }
      return;
    }

    setOpen((v) => !v);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      // clipboard blocked — silently ignore, item just won't confirm
    }
  }

  const whatsappHref = () =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(`${document.title} ${window.location.href}`)}`;
  const telegramHref = () =>
    `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
      document.title
    )}`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleShare}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-ink/15 text-ink/60 hover:text-turquoise hover:border-turquoise transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-md border border-ink/10 bg-white shadow-lg py-1 z-20"
        >
          <a
            role="menuitem"
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-plaster"
          >
            <WhatsAppIcon size={17} color="#25D366" />
            {t(locale, "shareWhatsapp")}
          </a>
          <a
            role="menuitem"
            href={telegramHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-plaster"
          >
            <TelegramIcon size={17} color="#229ED9" />
            {t(locale, "shareTelegram")}
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-plaster text-left"
          >
            <LinkIcon />
            {copied ? t(locale, "shareCopied") : t(locale, "shareCopyLink")}
          </button>
        </div>
      )}
    </div>
  );
}
