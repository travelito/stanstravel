"use client";

import { useState } from "react";
import type { PriceTier, PricingModel } from "@/lib/pricing";

const inputClass = "border border-ink/20 rounded-md px-3 py-2 bg-white w-full";
const labelClass = "flex flex-col gap-1 text-sm";

type TierRow = PriceTier & { key: number };

let nextKey = 0;
function toRows(tiers: PriceTier[]): TierRow[] {
  return tiers.map((t) => ({ ...t, key: nextKey++ }));
}

export function PricingFields({
  defaultModel,
  defaultPricePerPerson,
  defaultTiers,
}: {
  defaultModel: PricingModel;
  defaultPricePerPerson: number;
  defaultTiers: PriceTier[];
}) {
  const [model, setModel] = useState<PricingModel>(defaultModel);
  const [pricePerPerson, setPricePerPerson] = useState(String(defaultPricePerPerson || ""));
  const [rows, setRows] = useState<TierRow[]>(
    defaultTiers.length > 0 ? toRows(defaultTiers) : toRows([{ from: 1, to: 1, price: 0 }])
  );

  const updateRow = (key: number, patch: Partial<PriceTier>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    const last = rows[rows.length - 1];
    const from = last ? last.to + 1 : 1;
    setRows((prev) => [...prev, { key: nextKey++, from, to: from, price: 0 }]);
  };

  const removeRow = (key: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  };

  const tiersJson = JSON.stringify(rows.map(({ from, to, price }) => ({ from, to, price })));

  return (
    <div className="flex flex-col gap-4 rounded-md border border-ink/10 p-4">
      <p className="text-sm font-semibold">Pricing</p>

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="pricing_model"
            value="per_person"
            checked={model === "per_person"}
            onChange={() => setModel("per_person")}
          />
          Per person
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="pricing_model"
            value="group"
            checked={model === "group"}
            onChange={() => setModel("group")}
          />
          Group pricing
        </label>
      </div>

      {model === "per_person" ? (
        <label className={labelClass}>
          Price per person, $
          <input
            type="number"
            name="price_usd"
            required
            min={0.01}
            step="0.01"
            value={pricePerPerson}
            onChange={(e) => setPricePerPerson(e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
        </label>
      ) : (
        <div className="flex flex-col gap-2">
          <input type="hidden" name="price_tiers" value={tiersJson} />
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-ink/60">
            <span>From travelers</span>
            <span>To travelers</span>
            <span>Total price, $</span>
            <span />
          </div>
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input
                type="number"
                min={1}
                value={row.from}
                onChange={(e) => updateRow(row.key, { from: Number(e.target.value) })}
                className={inputClass}
              />
              <input
                type="number"
                min={1}
                value={row.to}
                onChange={(e) => updateRow(row.key, { to: Number(e.target.value) })}
                className={inputClass}
              />
              <input
                type="number"
                min={0.01}
                step="0.01"
                value={row.price}
                onChange={(e) => updateRow(row.key, { price: Number(e.target.value) })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                aria-label="Remove tier"
                className="px-2 text-ink/50 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="mt-1 self-start text-sm text-indigo hover:text-turquoise"
          >
            + Add price tier
          </button>
          <p className="text-xs text-ink/50">
            Ranges may have gaps (e.g. no tier for 3–4 travelers) — visitors in a gap see a
            &quot;contact us&quot; prompt instead of a price. Ranges must not overlap.
          </p>
        </div>
      )}
    </div>
  );
}
