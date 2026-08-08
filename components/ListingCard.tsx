import Link from "next/link";
import { ListingImage } from "@/components/ListingImage";

export function ListingCard({
  href,
  image,
  imageAlt,
  eyebrow,
  title,
  duration,
  fromLabel,
  price,
}: {
  href: string;
  image?: string | null;
  imageAlt: string;
  eyebrow: string;
  title: string;
  duration: string;
  fromLabel: string;
  price: number;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-turquoise/60 hover:shadow-md"
    >
      <div className="relative h-44 w-full sm:h-48">
        <ListingImage
          src={image}
          alt={imageAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[11px] text-plaster backdrop-blur-sm">
          {duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-turquoise">{eyebrow}</p>
        <h3 className="mt-1 font-display text-base leading-snug text-ink line-clamp-2 group-hover:text-indigo">
          {title}
        </h3>
        <div className="mt-auto flex items-baseline justify-between pt-3 font-mono text-sm">
          <span className="text-ink/50">{fromLabel}</span>
          <span className="text-base font-semibold text-indigo">${price}</span>
        </div>
      </div>
    </Link>
  );
}
