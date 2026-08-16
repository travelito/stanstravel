"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/storage";

const SWIPE_THRESHOLD = 50;

export function PhotoGallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const active = photos[selected] ?? photos[0];

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

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) goTo(selected - 1);
    else if (delta < -SWIPE_THRESHOLD) goTo(selected + 1);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label="Открыть фото на весь экран"
        className="relative h-72 w-full rounded-lg overflow-hidden block cursor-zoom-in"
      >
        <Image
          src={active.full}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </button>
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={photo.thumb + i}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative h-16 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                i === selected ? "border-turquoise" : "border-transparent"
              }`}
            >
              <Image src={photo.thumb} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
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
            <Image src={active.full} alt={alt} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}
