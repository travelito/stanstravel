import Link from "next/link";
import { getAllTrainTickets } from "@/lib/data/train-tickets";
import { deleteTrainTicket } from "@/app/admin/train-tickets/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

// Internal tool — always show what's actually in the database, never a
// cached snapshot.
export const dynamic = "force-dynamic";

export default async function AdminTrainTicketsPage() {
  const tickets = await getAllTrainTickets();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Жд-билеты</h1>
        <Link
          href="/admin/train-tickets/new"
          className="bg-indigo text-plaster px-4 py-2 rounded-md hover:bg-turquoise transition-colors"
        >
          + Новый билет
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-ink/10 font-mono text-xs uppercase text-ink/50">
            <th className="py-2 pr-4">Маршрут</th>
            <th className="py-2 pr-4">Поезд</th>
            <th className="py-2 pr-4">Цена</th>
            <th className="py-2 pr-4">Время в пути</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.slug} className="border-b border-ink/5">
              <td className="py-3 pr-4">
                {ticket.fromCity} → {ticket.toCity}
              </td>
              <td className="py-3 pr-4">{ticket.train}</td>
              <td className="py-3 pr-4 font-mono">${ticket.priceUsd}</td>
              <td className="py-3 pr-4 font-mono">{ticket.durationHours} ч</td>
              <td className="py-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-4">
                  <Link href={`/admin/train-tickets/${ticket.slug}`} className="text-turquoise hover:text-indigo">
                    Править
                  </Link>
                  <form action={deleteTrainTicket}>
                    <input type="hidden" name="slug" value={ticket.slug} />
                    <ConfirmSubmitButton
                      confirmMessage={`Удалить билет «${ticket.title.ru}»?`}
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
