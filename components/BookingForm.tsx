"use client";

import { useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import { whatsappNumber, telegramUsername } from "@/lib/contact";
import { WhatsAppIcon, TelegramIcon } from "@/components/BrandIcons";
import { calculatePrice, formatPrice, maxTravelers, type PricingConfig } from "@/lib/pricing";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateForMessage(iso: string, locale: Locale): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return locale === "ru" ? `${d}.${m}.${y}` : `${m}/${d}/${y}`;
}

// Mobile browsers (notably iOS Safari) paint <input type="date"/"time">
// with their own native grey fill and taller intrinsic box, ignoring our
// border/background/height — appearance-none lets our own border+bg+height
// actually render instead. Every sm: pair below restores today's exact
// desktop rendering (no appearance/bg override, text-sm's normal leading),
// so desktop is untouched.
const inputClass =
  "h-11 w-full appearance-none rounded-md border border-ink/15 bg-white px-3 text-sm leading-[2.75rem] text-ink focus:outline-none focus:border-turquoise sm:appearance-auto sm:bg-transparent sm:leading-5";
const fieldLabelClass = "flex flex-col gap-1 text-sm";
const fieldNameClass = "font-medium text-ink/80";

export function BookingForm({
  title,
  kindLabel,
  pricing,
  locale,
}: {
  title: string;
  kindLabel: string;
  pricing: PricingConfig;
  locale: Locale;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [pickup, setPickup] = useState("");

  const maxCount = useMemo(() => maxTravelers(pricing), [pricing]);
  const price = useMemo(() => calculatePrice(pricing, travelers), [pricing, travelers]);

  const tiers = pricing.model === "group" ? (pricing.tiers ?? []) : [];
  const showTierTable = tiers.length > 1;
  const activeTierIndex = tiers.findIndex((tier) => travelers >= tier.from && travelers <= tier.to);

  const notSpecified = t(locale, "bookingNotSpecified");

  const message = [
    t(locale, "bookingGreeting"),
    "",
    t(locale, "bookingIntro"),
    "",
    `${kindLabel}: ${title}`,
    `${t(locale, "bookingDate")}: ${date ? formatDateForMessage(date, locale) : notSpecified}`,
    ...(time ? [`${t(locale, "bookingStartTime")}: ${time}`] : []),
    `${t(locale, "bookingTravelers")}: ${travelers}`,
    `${t(locale, "bookingPickupLocation")}: ${pickup.trim() ? pickup : notSpecified}`,
    ...(price.status === "ok" ? [`${t(locale, "bookingTotalPrice")}: $${formatPrice(price.total)}`] : []),
    "",
    t(locale, "bookingClosing"),
  ].join("\n");

  const contactMessage = [
    t(locale, "bookingGreeting"),
    "",
    t(locale, "priceContactIntro"),
    "",
    `${kindLabel}: ${title}`,
    `${t(locale, "bookingTravelers")}: ${travelers}`,
  ].join("\n");

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const telegramHref = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
  const contactWhatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessage)}`;
  const contactTelegramHref = `https://t.me/${telegramUsername}?text=${encodeURIComponent(contactMessage)}`;

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
      {price.status === "ok" ? (
        <>
          <p className="font-mono text-xs uppercase tracking-wide text-ink/60">
            {t(locale, "bookingTotalPrice")}
          </p>
          <p className="font-display text-3xl font-bold text-indigo mt-1">${formatPrice(price.total)}</p>
          {pricing.model === "per_person" && (
            <p className="mt-1 font-mono text-sm text-ink/70">
              ${formatPrice(price.perPerson)} {t(locale, "perPerson")}
            </p>
          )}
        </>
      ) : (
        <p className="font-body text-sm text-ink/70">{t(locale, "priceContactMessage")}</p>
      )}
      <p className="mt-1.5 text-xs text-ink/50">{t(locale, "bookingPaymentNote")}</p>

      {showTierTable && (
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-ink/15 text-left font-mono text-xs uppercase tracking-wide text-ink/70">
              <th className="pb-2 font-bold">{t(locale, "tierTableTravelers")}</th>
              <th className="pb-2 text-right font-bold">{t(locale, "tierTableTotal")}</th>
              <th className="pb-2 text-right font-bold">{t(locale, "tierTablePerPerson")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {tiers.map((tier, i) => (
              <tr
                key={`${tier.from}-${tier.to}`}
                onClick={() => setTravelers(tier.from)}
                className={`cursor-pointer transition-colors ${
                  i === activeTierIndex
                    ? "bg-turquoise/20 font-bold text-ink"
                    : "font-medium text-ink/80 hover:bg-turquoise/10"
                }`}
              >
                <td className="rounded-l-md py-2.5 pl-2">
                  {tier.from === tier.to ? tier.from : `${tier.from}–${tier.to}`}
                </td>
                <td className="py-2.5 text-right">${formatPrice(tier.price)}</td>
                <td className="rounded-r-md py-2.5 pr-2 text-right">${formatPrice(tier.price / tier.from)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-5 flex flex-col gap-4">
        <label className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingDate")}</span>
          <div className="relative">
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} pr-9 sm:pr-3 ${date ? "" : "text-transparent"}`}
            />
            {!date && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                {t(locale, "bookingDatePlaceholder")}
              </span>
            )}
            {/* appearance-none can drop Safari's native calendar icon on
                mobile — this stand-in keeps one visible there; sm:hidden
                because desktop keeps its native icon untouched. */}
            <Calendar
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 sm:hidden"
            />
          </div>
        </label>

        <label className={fieldLabelClass}>
          <span className={fieldNameClass}>{t(locale, "bookingStartTime")}</span>
          <div className="relative">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputClass} pr-9 sm:pr-3 ${time ? "" : "text-transparent"}`}
            />
            {!time && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                {t(locale, "bookingTimePlaceholder")}
              </span>
            )}
            <Clock
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 sm:hidden"
            />
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
              onClick={() => setTravelers((n) => Math.min(maxCount, n + 1))}
              disabled={travelers >= maxCount}
              aria-label="+"
              className="flex h-8 w-8 items-center justify-center justify-self-end rounded-md text-ink/70 hover:text-turquoise transition-colors disabled:opacity-30 disabled:hover:text-ink/70"
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

      {price.status === "unavailable" ? (
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={contactWhatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-body text-white hover:bg-[#1da851] transition-colors"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
          <a
            href={contactTelegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#229ED9] px-5 py-3 font-body text-white hover:bg-[#1b87b9] transition-colors"
          >
            <TelegramIcon size={18} />
            Telegram
          </a>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-body text-white hover:bg-[#1da851] transition-colors"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-[#229ED9] px-5 py-3 font-body text-white hover:bg-[#1b87b9] transition-colors"
          >
            <TelegramIcon size={18} />
            Telegram
          </a>
        </div>
      )}
    </div>
  );
}
