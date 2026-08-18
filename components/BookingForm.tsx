"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { whatsappNumber, telegramUsername } from "@/lib/contact";
import { WhatsAppIcon, TelegramIcon } from "@/components/BrandIcons";

const MAX_TRAVELERS = 20;

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateForMessage(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-");
  return locale === "ru" ? `${d}.${m}.${y}` : `${m}/${d}/${y}`;
}

const inputClass =
  "h-11 w-full rounded-md border border-ink/15 px-3 text-sm text-ink focus:outline-none focus:border-turquoise";
const fieldLabelClass = "flex flex-col gap-1 text-sm";
const fieldNameClass = "font-medium text-ink/80";

export function BookingForm({
  title,
  kindLabel,
  priceUsd,
  locale,
}: {
  title: string;
  kindLabel: string;
  priceUsd: number;
  locale: Locale;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [pickup, setPickup] = useState("");

  const totalPrice = priceUsd * travelers;
  const canSubmit = date.trim() !== "" && pickup.trim() !== "";

  const message = [
    t(locale, "bookingGreeting"),
    "",
    t(locale, "bookingIntro"),
    "",
    `${kindLabel}: ${title}`,
    `${t(locale, "bookingDate")}: ${formatDateForMessage(date, locale)}`,
    ...(time ? [`${t(locale, "bookingStartTime")}: ${time}`] : []),
    `${t(locale, "bookingTravelers")}: ${travelers}`,
    `${t(locale, "bookingPickupLocation")}: ${pickup}`,
    "",
    t(locale, "bookingClosing"),
  ].join("\n");

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const telegramHref = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wide text-ink/50">{t(locale, "fromPrice")}</p>
      <p className="font-display text-3xl font-semibold text-indigo mt-1">
        ${priceUsd} <span className="font-body text-sm font-normal text-ink/50">{t(locale, "perPerson")}</span>
      </p>
      <p className="mt-1.5 text-xs text-ink/50">{t(locale, "bookingPaymentNote")}</p>

      <div className="mt-5 flex flex-col gap-4">
        <label className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingDate")}</span>
          <div className="relative">
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} ${date ? "" : "text-transparent"}`}
            />
            {!date && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                {t(locale, "bookingDatePlaceholder")}
              </span>
            )}
          </div>
        </label>

        <label className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingStartTime")}</span>
          <div className="relative">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputClass} ${time ? "" : "text-transparent"}`}
            />
            {!time && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                {t(locale, "bookingTimePlaceholder")}
              </span>
            )}
          </div>
        </label>

        <div className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingTravelers")}</span>
          <div className="grid h-11 grid-cols-3 items-center rounded-md border border-ink/15 px-2">
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.max(1, n - 1))}
              aria-label="−"
              className="flex h-8 w-8 items-center justify-center justify-self-start rounded-md text-ink/70 hover:text-turquoise transition-colors"
            >
              −
            </button>
            <span className="text-center font-mono text-sm">{travelers}</span>
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.min(MAX_TRAVELERS, n + 1))}
              aria-label="+"
              className="flex h-8 w-8 items-center justify-center justify-self-end rounded-md text-ink/70 hover:text-turquoise transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <label className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingPickupLocation")}</span>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder={t(locale, "bookingPickupPlaceholder")}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <span className="font-mono text-sm text-ink/60">{t(locale, "bookingTotalPrice")}</span>
        <span className="font-display text-xl font-semibold text-indigo">${totalPrice}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {canSubmit ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-body text-white hover:bg-[#1da851] transition-colors"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-md bg-[#25D366]/50 px-5 py-3 font-body text-white cursor-not-allowed"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </button>
        )}
        {canSubmit ? (
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#229ED9] px-5 py-3 font-body text-white hover:bg-[#1b87b9] transition-colors"
          >
            <TelegramIcon size={18} />
            Telegram
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 rounded-md bg-[#229ED9]/50 px-5 py-3 font-body text-white cursor-not-allowed"
          >
            <TelegramIcon size={18} />
            Telegram
          </button>
        )}
      </div>
    </div>
  );
}
