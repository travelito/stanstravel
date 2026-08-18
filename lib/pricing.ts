// Shared pricing engine for excursions — imported by both the client
// booking widget (instant display) and the admin server action (source of
// truth at save time). Keeping the math in one place means the number the
// visitor sees is always the number that gets baked into the booking
// message, and the admin's tier validation can't drift from what the
// booking widget actually does with those tiers.

export type PriceTier = { from: number; to: number; price: number };
export type PricingModel = "per_person" | "group";

export type PricingConfig = {
  model: PricingModel;
  pricePerPerson: number;
  tiers: PriceTier[] | null;
};

export type PriceResult =
  | { status: "ok"; total: number; perPerson: number }
  | { status: "unavailable" };

const PER_PERSON_MAX_TRAVELERS = 30;

export function calculatePrice(config: PricingConfig, travelers: number): PriceResult {
  if (config.model === "per_person") {
    const total = config.pricePerPerson * travelers;
    return { status: "ok", total, perPerson: config.pricePerPerson };
  }
  const tier = (config.tiers ?? []).find((t) => travelers >= t.from && travelers <= t.to);
  if (!tier) return { status: "unavailable" };
  return { status: "ok", total: tier.price, perPerson: tier.price / travelers };
}

export function maxTravelers(config: PricingConfig): number {
  if (config.model === "per_person") return PER_PERSON_MAX_TRAVELERS;
  const tiers = config.tiers ?? [];
  if (tiers.length === 0) return 1;
  return Math.max(...tiers.map((t) => t.to));
}

export function cheapestTotal(config: PricingConfig): number {
  if (config.model === "per_person") return config.pricePerPerson;
  const tiers = config.tiers ?? [];
  if (tiers.length === 0) return 0;
  return Math.min(...tiers.map((t) => t.price));
}

export function formatPrice(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2);
}

// Returns an error message (untranslated, admin-facing) or null if valid.
// Overlaps are rejected; gaps between tiers are allowed by design — an
// admin may intentionally leave a group size unpriced.
export function validateTiers(tiers: PriceTier[]): string | null {
  if (tiers.length === 0) return "At least one price tier is required for group pricing.";
  for (const t of tiers) {
    if (!Number.isFinite(t.from) || !Number.isFinite(t.to) || t.from < 1 || t.to < t.from) {
      return `Invalid range ${t.from}-${t.to}.`;
    }
    if (!Number.isFinite(t.price) || t.price <= 0) {
      return `Invalid price for range ${t.from}-${t.to}.`;
    }
  }
  const sorted = [...tiers].sort((a, b) => a.from - b.from);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].from <= sorted[i - 1].to) {
      return `Overlapping ranges: ${sorted[i - 1].from}-${sorted[i - 1].to} and ${sorted[i].from}-${sorted[i].to}.`;
    }
  }
  return null;
}
