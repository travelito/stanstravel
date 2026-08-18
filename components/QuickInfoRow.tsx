import type { LucideIcon } from "lucide-react";

export type QuickInfoItem = {
  icon: LucideIcon;
  label: string;
};

export function QuickInfoRow({ items }: { items: QuickInfoItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo/10 px-3 py-1.5 font-mono text-sm font-medium text-indigo"
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
