import type { SupabaseClient } from "@supabase/supabase-js";

export type Photo = { thumb: string; medium: string; full: string };

const BUCKET = "listing-photos";

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

// `photos` in the DB stores paths relative to the bucket, not full URLs —
// portable across projects/domains and trivial to delete by path later.
export function photoPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

// Resolves the `photos` jsonb column (array of storage paths) into public
// URLs, falling back to the legacy single `image` column for rows that
// predate multi-photo support (Stage 3) so old data keeps rendering.
export function resolvePhotos(photoPaths: Photo[] | null | undefined, legacyImage: string | null): Photo[] {
  if (photoPaths && photoPaths.length > 0) {
    return photoPaths.map((p) => ({
      thumb: photoPublicUrl(p.thumb),
      medium: photoPublicUrl(p.medium),
      full: photoPublicUrl(p.full),
    }));
  }
  if (legacyImage) {
    return [{ thumb: legacyImage, medium: legacyImage, full: legacyImage }];
  }
  return [];
}

export async function uploadListingPhoto(
  supabase: SupabaseClient,
  path: string,
  blob: Blob
): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp" });

  if (error) {
    throw new Error(`Не удалось загрузить фото: ${error.message}`);
  }
}

export async function removeListingPhotoFiles(supabase: SupabaseClient, paths: string[]): Promise<void> {
  await supabase.storage.from(BUCKET).remove(paths);
}
