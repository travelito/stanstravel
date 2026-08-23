import { Footprints, Car } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/dictionary";
import type { QuickInfoItem } from "@/components/QuickInfoRow";

export function tourPaceQuickInfoItem(pace: string | null, locale: Locale): QuickInfoItem | null {
  if (pace === "walking") return { icon: Footprints, label: t(locale, "quickInfoPaceWalking") };
  if (pace === "transport") return { icon: Car, label: t(locale, "quickInfoPaceTransport") };
  if (pace === "mixed") return { icon: Footprints, label: t(locale, "quickInfoPaceMixed") };
  return null;
}
