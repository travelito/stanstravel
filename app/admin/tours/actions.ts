"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateTourPaths } from "@/lib/revalidate";
import { resolvePhotoField } from "@/lib/storage";

function paragraphs(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function tourPayload(formData: FormData) {
  return {
    city: String(formData.get("city") ?? ""),
    duration_value: Number(formData.get("duration_value")),
    duration_unit: String(formData.get("duration_unit") ?? "hours"),
    price_usd: Number(formData.get("price_usd")),
    title: { ru: String(formData.get("title_ru") ?? ""), en: String(formData.get("title_en") ?? "") },
    summary: { ru: String(formData.get("summary_ru") ?? ""), en: String(formData.get("summary_en") ?? "") },
    description: {
      ru: paragraphs(formData.get("description_ru")),
      en: paragraphs(formData.get("description_en")),
    },
    highlights: {
      ru: paragraphs(formData.get("highlights_ru")),
      en: paragraphs(formData.get("highlights_en")),
    },
  };
}

export async function createTour(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();

  let photo: { image?: string | null };
  try {
    photo = await resolvePhotoField(supabase, "tours", slug, formData);
  } catch (e) {
    redirect(`/admin/tours/new?error=${encodeURIComponent((e as Error).message)}`);
  }

  const { error } = await supabase.from("tours").insert({ slug, ...tourPayload(formData), ...photo });

  if (error) {
    redirect(`/admin/tours/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTourPaths(slug);
  redirect("/admin/tours");
}

export async function updateTour(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();

  let photo: { image?: string | null };
  try {
    photo = await resolvePhotoField(supabase, "tours", slug, formData);
  } catch (e) {
    redirect(`/admin/tours/${slug}?error=${encodeURIComponent((e as Error).message)}`);
  }

  const { error } = await supabase
    .from("tours")
    .update({ ...tourPayload(formData), ...photo, updated_at: new Date().toISOString().slice(0, 10) })
    .eq("slug", slug);

  if (error) {
    redirect(`/admin/tours/${slug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTourPaths(slug);
  redirect("/admin/tours");
}

export async function deleteTour(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  await supabase.from("tours").delete().eq("slug", slug);

  revalidateTourPaths(slug);
  redirect("/admin/tours");
}
