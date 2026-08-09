"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/storage";

export function PhotoGallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const active = photos[selected] ?? photos[0];

  return (
    <div>
      <div className="relative h-72 w-full rounded-lg overflow-hidden">
        <Image
          src={active.full}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
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
    </div>
  );
}
