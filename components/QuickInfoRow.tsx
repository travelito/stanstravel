import type { LucideIcon } from "lucide-react";

export type QuickInfoItem = {
  icon: LucideIcon;
  label: string;
};

export function QuickInfoRow({ items }: { items: QuickInfoItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-ink/70">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <item.icon className="h-4 w-4 text-turquoise" aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
