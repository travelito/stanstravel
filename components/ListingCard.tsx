import Link from "next/link";
import type { Photo } from "@/lib/storage";
import { CardPhotoSwiper } from "@/components/CardPhotoSwiper";

export function ListingCard({
  href,
  photos,
  imageAlt,
  eyebrow,
  title,
  duration,
  fromLabel,
  price,
}: {
  href: string;
  photos: Photo[];
  imageAlt: string;
  eyebrow: string;
  title: string;
  duration: string;
  fromLabel: string;
  price: number;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-turquoise/60 hover:shadow-md">
      <div className="relative h-52 w-full sm:h-56">
        <CardPhotoSwiper
          href={href}
          photos={photos}
          alt={imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <Link href={href} className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-turquoiseDark">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink group-hover:text-indigo group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 font-mono text-sm font-medium text-ink/70">{duration}</p>
        <div className="mt-auto flex items-baseline justify-between pt-3 font-mono text-sm">
          <span className="font-semibold text-ink/70">{fromLabel}</span>
          <span className="text-base font-semibold text-indigo">${price}</span>
        </div>
      </Link>
    </div>
  );
}
