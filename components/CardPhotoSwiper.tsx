"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Photo } from "@/lib/storage";
import { ListingImage } from "@/components/ListingImage";

const SWIPE_THRESHOLD = 40;

export function CardPhotoSwiper({
  href,
  photos,
  alt,
  sizes,
}: {
  href: string;
  photos: Photo[];
  alt: string;
  sizes: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (photos.length === 0) {
    return (
      <Link href={href} className="absolute inset-0 block">
        <ListingImage src={null} alt={alt} sizes={sizes} />
      </Link>
    );
  }

  if (photos.length === 1) {
    return (
      <Link href={href} className="absolute inset-0 block">
        <Image src={photos[0].medium} alt={alt} fill className="object-cover" sizes={sizes} />
      </Link>
    );
  }

  const goTo = (i: number) => {
    if (i < 0 || i >= photos.length) return;
    setIndex(i);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) goTo(index - 1);
    else if (delta < -SWIPE_THRESHOLD) goTo(index + 1);
  };

  const mounted = [index - 1, index, index + 1].filter((i) => i >= 0 && i < photos.length);

  return (
    <div className="absolute inset-0" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 block">
        {mounted.map((i) => (
          <Image
            key={i}
            src={photos[i].medium}
            alt={i === index ? alt : ""}
            fill
            loading="lazy"
            className={`object-cover transition-opacity duration-200 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            sizes={sizes}
          />
        ))}
      </Link>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Предыдущее фото"
        className="absolute left-0 inset-y-0 z-10 flex w-1/3 items-center justify-start pl-1 disabled:pointer-events-none"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/60 text-plaster opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          ‹
        </span>
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        disabled={index === photos.length - 1}
        aria-label="Следующее фото"
        className="absolute right-0 inset-y-0 z-10 flex w-1/3 items-center justify-end pr-1 disabled:pointer-events-none"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/60 text-plaster opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          ›
        </span>
      </button>

      <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center gap-1">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Фото ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-plaster" : "w-1.5 bg-plaster/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
