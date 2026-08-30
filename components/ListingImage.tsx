import Image from "next/image";

// Renders the real photo when one is set; otherwise a themed placeholder
// so cards never break while photos are being uploaded to Supabase Storage.
export function ListingImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-clay/25 via-plaster to-turquoise/20">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-9 w-9 text-ink/25"
        aria-hidden="true"
      >
        <path d="M12 21c4-4.5 7-8.2 7-11.5A7 7 0 0 0 5 9.5C5 12.8 8 16.5 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <span className="sr-only">{alt}</span>
    </div>
  );
}
