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
