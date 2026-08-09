"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateExcursionPaths } from "@/lib/revalidate";
import { resolvePhotoField } from "@/lib/storage";

function excursionPayload(formData: FormData) {
  return {
    city: String(formData.get("city") ?? ""),
    duration_hours: Number(formData.get("duration_hours")),
    price_usd: Number(formData.get("price_usd")),
    title: { ru: String(formData.get("title_ru") ?? ""), en: String(formData.get("title_en") ?? "") },
    summary: { ru: String(formData.get("summary_ru") ?? ""), en: String(formData.get("summary_en") ?? "") },
  };
}

export async function createExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();

  let photo: { image?: string | null };
  try {
    photo = await resolvePhotoField(supabase, "excursions", slug, formData);
  } catch (e) {
    redirect(`/admin/excursions/new?error=${encodeURIComponent((e as Error).message)}`);
  }

  const { error } = await supabase.from("excursions").insert({ slug, ...excursionPayload(formData), ...photo });

  if (error) {
    redirect(`/admin/excursions/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateExcursionPaths(slug);
  redirect("/admin/excursions");
}

export async function updateExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();

  let photo: { image?: string | null };
  try {
    photo = await resolvePhotoField(supabase, "excursions", slug, formData);
  } catch (e) {
    redirect(`/admin/excursions/${slug}?error=${encodeURIComponent((e as Error).message)}`);
  }

  const { error } = await supabase
    .from("excursions")
    .update({ ...excursionPayload(formData), ...photo, updated_at: new Date().toISOString().slice(0, 10) })
    .eq("slug", slug);

  if (error) {
    redirect(`/admin/excursions/${slug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateExcursionPaths(slug);
  redirect("/admin/excursions");
}

export async function deleteExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  await supabase.from("excursions").delete().eq("slug", slug);

  revalidateExcursionPaths(slug);
  redirect("/admin/excursions");
}
