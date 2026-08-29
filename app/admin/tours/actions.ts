"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateTourPaths } from "@/lib/revalidate";
import { cheapestTotal, validateTiers, type PriceTier, type PricingModel } from "@/lib/pricing";

function paragraphs(value: FormDataEntryValue | null): string[] {
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

function tourPayload(formData: FormData): { payload: Record<string, unknown> } | { error: string } {
  const pricing = parsePricing(formData);
  if ("error" in pricing) return pricing;

  return {
    payload: {
      city: String(formData.get("city") ?? ""),
      duration_value: Number(formData.get("duration_value")),
      duration_unit: String(formData.get("duration_unit") ?? "hours"),
      price_usd: pricing.price_usd,
      pricing_model: pricing.pricing_model,
      price_tiers: pricing.price_tiers,
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
      itinerary: { ru: paragraphs(formData.get("itinerary_ru")), en: paragraphs(formData.get("itinerary_en")) },
      included: { ru: paragraphs(formData.get("included_ru")), en: paragraphs(formData.get("included_en")) },
      not_included: {
        ru: paragraphs(formData.get("not_included_ru")),
        en: paragraphs(formData.get("not_included_en")),
      },
      tour_type: nullableText(formData.get("tour_type")),
      guide_language: nullableText(formData.get("guide_language")),
      pickup_included: nullableBool(formData.get("pickup_included")),
      tour_pace: nullableText(formData.get("tour_pace")),
    },
  };
}

export async function createTour(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = tourPayload(formData);
  if ("error" in result) {
    redirect(`/admin/tours/new?error=${encodeURIComponent(result.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tours").insert({ slug, ...result.payload });

  if (error) {
    redirect(`/admin/tours/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTourPaths(slug);
  redirect(`/admin/tours/${slug}`);
}

export async function updateTour(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = tourPayload(formData);
  if ("error" in result) {
    redirect(`/admin/tours/${slug}?error=${encodeURIComponent(result.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tours")
    .update({ ...result.payload, updated_at: new Date().toISOString().slice(0, 10) })
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
