"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/storage";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";

const SWIPE_THRESHOLD = 50;
const HERO_SIZES = "(max-width: 640px) 100vw, 66vw";

export function PhotoGallery({ photos, alt, locale }: { photos: Photo[]; alt: string; locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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

  // Swiping the inline hero photo just switches the selected photo — it
  // doesn't open or close anything, unlike the lightbox swipe above.
  const onMainTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onMainTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;
    if (dx > SWIPE_THRESHOLD) goTo(selected - 1);
    else if (dx < -SWIPE_THRESHOLD) goTo(selected + 1);
  };

  // Mount the previous/next photo alongside the selected one (invisible via
  // opacity) so the browser starts fetching them immediately — clicking a
  // thumbnail or swiping then just crossfades to an already-loaded image
  // instead of waiting on a fresh request each time.
  const neighbors = [selected - 1, selected, selected + 1].filter((i) => i >= 0 && i < photos.length);

  return (
    <div className={`grid gap-2 ${photos.length > 1 ? "sm:grid-cols-[2fr_1fr] sm:h-[420px]" : ""}`}>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={onMainTouchStart}
        onTouchEnd={onMainTouchEnd}
        aria-label="Открыть фото на весь экран"
        className="relative h-72 sm:h-full w-full rounded-xl overflow-hidden block cursor-zoom-in"
      >
        {neighbors.map((i) => (
          <Image
            key={i}
            src={photos[i].full}
            alt={i === selected ? alt : ""}
            fill
            loading="eager"
            className={`object-cover transition-opacity duration-150 ${
              i === selected ? "opacity-100" : "opacity-0"
            }`}
            sizes={HERO_SIZES}
          />
        ))}
      </button>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:h-full sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
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
