"use client";

import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/storage";
import { ListingImage } from "@/components/ListingImage";

// Catalog/homepage cards show only the first photo, statically — no swipe,
// arrows, or dots. The full multi-photo slider lives on the excursion/tour
// detail page (components/PhotoGallery.tsx) and is untouched by this.
export function CardPhotoSwiper({
  href,
  photos,
  alt,
  sizes,
  priority,
}: {
  href: string;
  photos: Photo[];
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (photos.length === 0) {
    return (
      <Link href={href} className="absolute inset-0 block">
        <ListingImage src={null} alt={alt} sizes={sizes} priority={priority} />
      </Link>
    );
  }

  return (
    <Link href={href} className="absolute inset-0 block">
      <Image src={photos[0].medium} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
    </Link>
  );
}
