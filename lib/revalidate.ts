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

  // Admin list/edit pages aren't statically generated, but Next.js still
  // prefetches and client-caches their rendered output — without this, the
  // edit form can keep showing pre-save data after a Link navigation back
  // into it, even though the DB write already succeeded.
  revalidatePath("/admin/tours");
  if (slug) revalidatePath(`/admin/tours/${slug}`);
}

export function revalidateExcursionPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/excursions`);
    if (slug) revalidatePath(`/${locale}/excursions/${slug}`);
  }
  revalidatePath("/sitemap.xml");

  revalidatePath("/admin/excursions");
  if (slug) revalidatePath(`/admin/excursions/${slug}`);
}

export function revalidateTransferPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/transfers`);
    if (slug) revalidatePath(`/${locale}/transfers/${slug}`);
  }
  revalidatePath("/sitemap.xml");

  revalidatePath("/admin/transfers");
  if (slug) revalidatePath(`/admin/transfers/${slug}`);
}

export function revalidateTrainTicketPaths(slug?: string) {
  revalidatePath("/");
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/train-tickets`);
    if (slug) revalidatePath(`/${locale}/train-tickets/${slug}`);
  }
  revalidatePath("/sitemap.xml");

  revalidatePath("/admin/train-tickets");
  if (slug) revalidatePath(`/admin/train-tickets/${slug}`);
}
