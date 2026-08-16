import { revalidatePath } from "next/cache";
import { locales } from "@/lib/locales";

export function revalidateTourPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/tours`);
    if (slug) revalidatePath(`/${locale}/tours/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export function revalidateExcursionPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/excursions`);
    if (slug) revalidatePath(`/${locale}/excursions/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export function revalidateTransferPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/transfers`);
    if (slug) revalidatePath(`/${locale}/transfers/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export function revalidateTrainTicketPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/train-tickets`);
    if (slug) revalidatePath(`/${locale}/train-tickets/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}
