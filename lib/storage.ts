import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "listing-photos";
const MAX_SIZE = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadListingPhoto(
  supabase: SupabaseClient,
  folder: "tours" | "excursions",
  slug: string,
  file: File
): Promise<string> {
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Поддерживаются только фото в формате JPEG, PNG или WebP");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Фото весит больше 5 МБ — сожмите и попробуйте снова");
  }

  const path = `${folder}/${slug}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    throw new Error(`Не удалось загрузить фото: ${error.message}`);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Reads the `photo`/`remove_photo` fields a form may submit and resolves
// what (if anything) the `image` column should become. Returns `{}` when
// neither was submitted, so callers can spread the result without
// overwriting an existing photo on unrelated edits.
export async function resolvePhotoField(
  supabase: SupabaseClient,
  folder: "tours" | "excursions",
  slug: string,
  formData: FormData
): Promise<{ image?: string | null }> {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    return { image: await uploadListingPhoto(supabase, folder, slug, file) };
  }
  if (formData.get("remove_photo")) {
    return { image: null };
  }
  return {};
}
