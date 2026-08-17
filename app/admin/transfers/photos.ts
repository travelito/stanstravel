"use server";

import { createClient } from "@/lib/auth/supabase-server";
import { removeListingPhotoFiles, type Photo } from "@/lib/storage";
import { revalidateTransferPaths } from "@/lib/revalidate";

export async function addTransferPhoto(slug: string, photo: Photo): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("append_transfer_photo", { p_slug: slug, p_photo: photo });

  if (error) return { error: error.message };

  revalidateTransferPaths(slug);
  return {};
}

export async function removeTransferPhoto(slug: string, index: number): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Look up the authoritative storage paths ourselves rather than trusting
  // whatever the client sends — `photos` holds paths, not public URLs.
  const { data } = await supabase.from("transfers").select("photos").eq("slug", slug).maybeSingle();
  const paths: Photo[] = data?.photos ?? [];
  const target = paths[index];
  if (target) {
    await removeListingPhotoFiles(supabase, [target.thumb, target.medium, target.full]);
  }

  const { error } = await supabase.rpc("remove_transfer_photo", { p_slug: slug, p_index: index });
  if (error) return { error: error.message };

  revalidateTransferPaths(slug);
  return {};
}

export async function reorderTransferPhoto(slug: string, from: number, to: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reorder_transfer_photo", { p_slug: slug, p_from: from, p_to: to });
  if (error) return { error: error.message };

  revalidateTransferPaths(slug);
  return {};
}
