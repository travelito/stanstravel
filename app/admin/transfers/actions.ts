"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateTransferPaths } from "@/lib/revalidate";

function transferPayload(formData: FormData) {
  return {
    from_city: String(formData.get("from_city") ?? ""),
    to_city: String(formData.get("to_city") ?? ""),
    transport_type: String(formData.get("transport_type") ?? ""),
    price_usd: Number(formData.get("price_usd")),
    duration_hours: Number(formData.get("duration_hours")),
    title: { ru: String(formData.get("title_ru") ?? ""), en: String(formData.get("title_en") ?? "") },
    summary: { ru: String(formData.get("summary_ru") ?? ""), en: String(formData.get("summary_en") ?? "") },
  };
}

export async function createTransfer(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.from("transfers").insert({ slug, ...transferPayload(formData) });

  if (error) {
    redirect(`/admin/transfers/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTransferPaths(slug);
  redirect(`/admin/transfers/${slug}`);
}

export async function updateTransfer(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const { error } = await supabase
    .from("transfers")
    .update({ ...transferPayload(formData), updated_at: new Date().toISOString().slice(0, 10) })
    .eq("slug", slug);

  if (error) {
    redirect(`/admin/transfers/${slug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTransferPaths(slug);
  redirect("/admin/transfers");
}

export async function deleteTransfer(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  await supabase.from("transfers").delete().eq("slug", slug);

  revalidateTransferPaths(slug);
  redirect("/admin/transfers");
}
