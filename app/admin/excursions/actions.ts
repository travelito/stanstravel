"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateExcursionPaths } from "@/lib/revalidate";

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
  const { error } = await supabase.from("excursions").insert({ slug, ...excursionPayload(formData) });

  if (error) {
    redirect(`/admin/excursions/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateExcursionPaths(slug);
  redirect(`/admin/excursions/${slug}`);
}

export async function updateExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const { error } = await supabase
    .from("excursions")
    .update({ ...excursionPayload(formData), updated_at: new Date().toISOString().slice(0, 10) })
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
