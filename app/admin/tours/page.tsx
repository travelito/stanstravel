import Link from "next/link";
import { getAllTours } from "@/lib/data/tours";
import { deleteTour } from "@/app/admin/tours/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

// Internal tool — always show what's actually in the database, never a
// cached snapshot.
export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const tours = await getAllTours();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Туры</h1>
        <Link
          href="/admin/tours/new"
          className="bg-indigo text-plaster px-4 py-2 rounded-md hover:bg-turquoise transition-colors"
        >
          + Новый тур
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-ink/10 font-mono text-xs uppercase text-ink/50">
            <th className="py-2 pr-4">Город</th>
            <th className="py-2 pr-4">Заголовок</th>
            <th className="py-2 pr-4">Цена</th>
            <th className="py-2 pr-4">Длительность</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.slug} className="border-b border-ink/5">
              <td className="py-3 pr-4">{tour.city}</td>
              <td className="py-3 pr-4">{tour.title.ru}</td>
              <td className="py-3 pr-4 font-mono">${tour.priceUsd}</td>
              <td className="py-3 pr-4 font-mono">
                {tour.duration.value} {tour.duration.unit === "hours" ? "ч" : "дн"}
              </td>
              <td className="py-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-4">
                  <Link href={`/admin/tours/${tour.slug}`} className="text-turquoise hover:text-indigo">
                    Править
                  </Link>
                  <form action={deleteTour}>
                    <input type="hidden" name="slug" value={tour.slug} />
                    <ConfirmSubmitButton
                      confirmMessage={`Удалить тур «${tour.title.ru}»?`}
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
