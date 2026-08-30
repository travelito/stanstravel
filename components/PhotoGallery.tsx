"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/storage";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";

const SWIPE_THRESHOLD = 50;
const HERO_SIZES = "(max-width: 640px) 100vw, 66vw";
// Typical landscape-photo ratio, used only until a given slide's real
// dimensions are known (see mobileRatios below).
const FALLBACK_RATIO = 4 / 3;

export function PhotoGallery({ photos, alt, locale }: { photos: Photo[]; alt: string; locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  // Mobile-only: each photo's real width/height ratio, filled in as slides
  // load (fill-mode Image doesn't expose this any other way). The visible
  // slide's own ratio drives the track's height, so every photo shows at
  // its natural proportions at full width instead of being cropped into a
  // shared fixed-height box.
  const [mobileRatios, setMobileRatios] = useState<Record<number, number>>({});
  const mobileActiveRatio = mobileRatios[selected] ?? FALLBACK_RATIO;

  const goTo = (index: number) => {
    if (index < 0 || index >= photos.length) return;
    setSelected(index);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(selected - 1);
      if (e.key === "ArrowRight") goTo(selected + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, selected]);

  // Keep the mobile swipe track in sync with `selected` when it changes from
  // elsewhere (a desktop thumbnail click, lightbox arrows) — guarded so we
  // don't fight the user's own in-progress swipe via the scroll handler below.
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const target = selected * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 10) {
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: target, behavior: "auto" });
      requestAnimationFrame(() => {
        isProgrammaticScroll.current = false;
      });
    }
  }, [selected]);

  const onMobileScroll = () => {
    if (isProgrammaticScroll.current) return;
    const el = mobileScrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== selected) setSelected(index);
  };

  const onLightboxTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onLightboxTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > SWIPE_THRESHOLD) setLightboxOpen(false);
      return;
    }
    if (dx > SWIPE_THRESHOLD) goTo(selected - 1);
    else if (dx < -SWIPE_THRESHOLD) goTo(selected + 1);
  };

  // Mount the previous/next photo alongside the selected one (invisible via
  // opacity) so the browser starts fetching them immediately — clicking a
  // thumbnail then just crossfades to an already-loaded image instead of
  // waiting on a fresh request. Used by the desktop view and the lightbox.
  const neighbors = [selected - 1, selected, selected + 1].filter((i) => i >= 0 && i < photos.length);

  return (
    <div className={`sm:grid sm:gap-2 ${photos.length > 1 ? "sm:grid-cols-[2fr_1fr] sm:h-[420px]" : ""}`}>
      {/* Mobile — native horizontal scroll-snap for a smooth, inertial swipe.
          Track height follows the selected photo's own aspect ratio (see
          mobileActiveRatio) instead of a fixed height, so each photo shows
          at full width with no crop/zoom and no shared tall box. Capped at
          max-h-[60vh] so portrait photos can't stretch the block down the
          whole screen — object-contain then letterboxes instead of
          cropping when that cap kicks in. */}
      <div
        className="relative max-h-[60vh] overflow-hidden rounded-xl bg-ink/5 sm:hidden"
        style={{ aspectRatio: mobileActiveRatio }}
      >
        <div
          ref={mobileScrollRef}
          onScroll={onMobileScroll}
          className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.thumb + i}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Открыть фото на весь экран"
              className="relative h-full w-full flex-shrink-0 snap-center overflow-hidden"
            >
              <Image
                src={photo.medium}
                alt={i === 0 ? alt : ""}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                className="object-contain"
                sizes="100vw"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (!img.naturalWidth || !img.naturalHeight) return;
                  setMobileRatios((prev) =>
                    i in prev ? prev : { ...prev, [i]: img.naturalWidth / img.naturalHeight }
                  );
                }}
              />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-xs text-plaster">
            {selected + 1} / {photos.length}
          </span>
        )}
      </div>

      {/* Desktop — main photo + side thumbnail column */}
      <div className="relative hidden h-full w-full overflow-hidden rounded-xl sm:block">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Открыть фото на весь экран"
          className="absolute inset-0"
        >
          {neighbors.map((i) => (
            <Image
              key={i}
              src={photos[i].full}
              alt={i === selected ? alt : ""}
              fill
              loading="eager"
              priority={i === 0}
              className={`object-cover transition-opacity duration-150 ${
                i === selected ? "opacity-100" : "opacity-0"
              }`}
              sizes={HERO_SIZES}
            />
          ))}
        </button>

        {photos.length > 1 && selected > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(selected - 1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-plaster backdrop-blur-sm transition-colors hover:bg-ink"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {photos.length > 1 && selected < photos.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(selected + 1);
            }}
            aria-label="Следующее фото"
            className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-plaster backdrop-blur-sm transition-colors hover:bg-ink"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {photos.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-xs text-plaster">
            {selected + 1} / {photos.length}
          </span>
        )}
      </div>
      {photos.length > 1 && (
        <div className="hidden gap-2 pb-1 sm:flex sm:h-full sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
          {photos.map((photo, i) => (
            <button
              key={photo.thumb + i}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative h-16 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors sm:h-auto sm:w-full sm:min-h-[4.5rem] sm:flex-1 ${
                i === selected ? "border-turquoise" : "border-transparent"
              }`}
            >
              <Image
                src={photo.medium}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80px, 25vw"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onTouchStart={onLightboxTouchStart}
          onTouchEnd={onLightboxTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрыть"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink text-plaster hover:bg-turquoise transition-colors z-10"
          >
            ×
          </button>

          {selected > 0 && (
            <button
              type="button"
              onClick={() => goTo(selected - 1)}
              aria-label="Предыдущее фото"
              className="absolute left-2 sm:left-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink text-plaster hover:bg-turquoise transition-colors z-10"
            >
              ‹
            </button>
          )}
          {selected < photos.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(selected + 1)}
              aria-label="Следующее фото"
              className="absolute right-2 sm:right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink text-plaster hover:bg-turquoise transition-colors z-10"
            >
              ›
            </button>
          )}

          <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4">
            {neighbors.map((i) => (
              <Image
                key={i}
                src={photos[i].full}
                alt={i === selected ? alt : ""}
                fill
                loading="eager"
                className={`object-contain transition-opacity duration-150 ${
                  i === selected ? "opacity-100" : "opacity-0"
                }`}
                sizes="100vw"
              />
            ))}
          </div>

          {photos.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 text-center font-mono text-sm text-plaster">
              {selected + 1} {t(locale, "photoOf")} {photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
