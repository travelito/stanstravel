"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateExcursionPaths } from "@/lib/revalidate";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function nullableText(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

function nullableBool(value: FormDataEntryValue | null): boolean | null {
  const s = String(value ?? "");
  if (s === "true") return true;
  if (s === "false") return false;
  return null;
}

function excursionPayload(formData: FormData) {
  return {
    city: String(formData.get("city") ?? ""),
    duration_hours: Number(formData.get("duration_hours")),
    price_usd: Number(formData.get("price_usd")),
    title: { ru: String(formData.get("title_ru") ?? ""), en: String(formData.get("title_en") ?? "") },
    summary: { ru: String(formData.get("summary_ru") ?? ""), en: String(formData.get("summary_en") ?? "") },
    highlights: { ru: lines(formData.get("highlights_ru")), en: lines(formData.get("highlights_en")) },
    itinerary: { ru: lines(formData.get("itinerary_ru")), en: lines(formData.get("itinerary_en")) },
    included: { ru: lines(formData.get("included_ru")), en: lines(formData.get("included_en")) },
    not_included: {
      ru: lines(formData.get("not_included_ru")),
      en: lines(formData.get("not_included_en")),
    },
    tour_type: nullableText(formData.get("tour_type")),
    guide_language: nullableText(formData.get("guide_language")),
    pickup_included: nullableBool(formData.get("pickup_included")),
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
