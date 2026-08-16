"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-server";
import { revalidateTrainTicketPaths } from "@/lib/revalidate";

function trainTicketPayload(formData: FormData) {
  return {
    from_city: String(formData.get("from_city") ?? ""),
    to_city: String(formData.get("to_city") ?? ""),
    train: String(formData.get("train") ?? ""),
    price_usd: Number(formData.get("price_usd")),
    duration_hours: Number(formData.get("duration_hours")),
    title: { ru: String(formData.get("title_ru") ?? ""), en: String(formData.get("title_en") ?? "") },
    summary: { ru: String(formData.get("summary_ru") ?? ""), en: String(formData.get("summary_en") ?? "") },
  };
}

export async function createTrainTicket(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.from("train_tickets").insert({ slug, ...trainTicketPayload(formData) });

  if (error) {
    redirect(`/admin/train-tickets/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTrainTicketPaths(slug);
  redirect(`/admin/train-tickets/${slug}`);
}

export async function updateTrainTicket(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  const { error } = await supabase
    .from("train_tickets")
    .update({ ...trainTicketPayload(formData), updated_at: new Date().toISOString().slice(0, 10) })
    .eq("slug", slug);

  if (error) {
    redirect(`/admin/train-tickets/${slug}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateTrainTicketPaths(slug);
  redirect("/admin/train-tickets");
}

export async function deleteTrainTicket(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  await supabase.from("train_tickets").delete().eq("slug", slug);

  revalidateTrainTicketPaths(slug);
  redirect("/admin/train-tickets");
}
