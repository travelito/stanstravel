"use server";

import { createClient } from "@/lib/auth/supabase-server";
import { removeListingPhotoFiles, type Photo } from "@/lib/storage";
import { revalidateExcursionPaths } from "@/lib/revalidate";

export async function addExcursionPhoto(slug: string, photo: Photo): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("append_excursion_photo", { p_slug: slug, p_photo: photo });

  if (error) return { error: error.message };

  revalidateExcursionPaths(slug);
  return {};
}

export async function removeExcursionPhoto(slug: string, index: number): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data } = await supabase.from("excursions").select("photos").eq("slug", slug).maybeSingle();
  const paths: Photo[] = data?.photos ?? [];
  const target = paths[index];
  if (target) {
    await removeListingPhotoFiles(supabase, [target.thumb, target.medium, target.full]);
  }

  const { error } = await supabase.rpc("remove_excursion_photo", { p_slug: slug, p_index: index });
  if (error) return { error: error.message };

  revalidateExcursionPaths(slug);
  return {};
}

export async function reorderExcursionPhoto(slug: string, from: number, to: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reorder_excursion_photo", { p_slug: slug, p_from: from, p_to: to });
  if (error) return { error: error.message };

  revalidateExcursionPaths(slug);
  return {};
}
