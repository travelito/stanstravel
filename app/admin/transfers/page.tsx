import Link from "next/link";
import { getAllTransfers } from "@/lib/data/transfers";
import { deleteTransfer } from "@/app/admin/transfers/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export default async function AdminTransfersPage() {
  const transfers = await getAllTransfers();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Трансферы</h1>
        <Link
          href="/admin/transfers/new"
          className="bg-indigo text-plaster px-4 py-2 rounded-md hover:bg-turquoise transition-colors"
        >
          + Новый трансфер
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-ink/10 font-mono text-xs uppercase text-ink/50">
            <th className="py-2 pr-4">Маршрут</th>
            <th className="py-2 pr-4">Тип транспорта</th>
            <th className="py-2 pr-4">Цена</th>
            <th className="py-2 pr-4">Длительность</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.slug} className="border-b border-ink/5">
              <td className="py-3 pr-4">
                {transfer.fromCity} → {transfer.toCity}
              </td>
              <td className="py-3 pr-4">{transfer.transportType}</td>
              <td className="py-3 pr-4 font-mono">${transfer.priceUsd}</td>
              <td className="py-3 pr-4 font-mono">{transfer.durationHours} ч</td>
              <td className="py-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-4">
                  <Link href={`/admin/transfers/${transfer.slug}`} className="text-turquoise hover:text-indigo">
                    Править
                  </Link>
                  <form action={deleteTransfer}>
                    <input type="hidden" name="slug" value={transfer.slug} />
                    <ConfirmSubmitButton
                      confirmMessage={`Удалить трансфер «${transfer.title.ru}»?`}
                      className="text-red-700 hover:text-red-900"
                    >
                      Удалить
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
