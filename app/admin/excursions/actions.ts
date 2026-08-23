"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateExcursionPaths } from "@/lib/revalidate";
import { cheapestTotal, validateTiers, type PriceTier, type PricingModel } from "@/lib/pricing";

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

function parsePricing(
  formData: FormData
): { pricing_model: PricingModel; price_tiers: PriceTier[] | null; price_usd: number } | { error: string } {
  const model = String(formData.get("pricing_model") ?? "per_person") as PricingModel;

  if (model === "group") {
    let tiers: PriceTier[];
    try {
      tiers = JSON.parse(String(formData.get("price_tiers") ?? "[]"));
    } catch {
      return { error: "Invalid price tiers data." };
    }
    const validationError = validateTiers(tiers);
    if (validationError) return { error: validationError };
    return {
      pricing_model: "group",
      price_tiers: tiers,
      price_usd: cheapestTotal({ model: "group", pricePerPerson: 0, tiers }),
    };
  }

  const pricePerPerson = Number(formData.get("price_usd"));
  if (!Number.isFinite(pricePerPerson) || pricePerPerson <= 0) {
    return { error: "Price per person must be a number greater than 0." };
  }
  return { pricing_model: "per_person", price_tiers: null, price_usd: pricePerPerson };
}

function excursionPayload(formData: FormData): { payload: Record<string, unknown> } | { error: string } {
  const pricing = parsePricing(formData);
  if ("error" in pricing) return pricing;

  return {
    payload: {
      city: String(formData.get("city") ?? ""),
      duration_hours: Number(formData.get("duration_hours")),
      price_usd: pricing.price_usd,
      pricing_model: pricing.pricing_model,
      price_tiers: pricing.price_tiers,
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
      tour_pace: nullableText(formData.get("tour_pace")),
    },
  };
}

export async function createExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = excursionPayload(formData);
  if ("error" in result) {
    redirect(`/admin/excursions/new?error=${encodeURIComponent(result.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("excursions").insert({ slug, ...result.payload });

  if (error) {
    redirect(`/admin/excursions/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateExcursionPaths(slug);
  redirect(`/admin/excursions/${slug}`);
}

export async function updateExcursion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = excursionPayload(formData);
  if ("error" in result) {
    redirect(`/admin/excursions/${slug}?error=${encodeURIComponent(result.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("excursions")
    .update({ ...result.payload, updated_at: new Date().toISOString().slice(0, 10) })
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
