import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/data/tours";
import { updateTour, deleteTour } from "@/app/admin/tours/actions";
import { TourForm } from "@/components/admin/TourForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

// Internal tool — always show what's actually in the database, never a
// cached snapshot.
export const dynamic = "force-dynamic";

export default async function EditTourPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { error?: string };
}) {
  const tour = await getTourBySlug(params.slug);
  if (!tour) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Тур: {tour.title.ru}</h1>
        <form action={deleteTour}>
          <input type="hidden" name="slug" value={tour.slug} />
          <ConfirmSubmitButton
            confirmMessage={`Удалить тур «${tour.title.ru}»?`}
            className="text-red-700 hover:text-red-900 text-sm"
          >
            Удалить
          </ConfirmSubmitButton>
        </form>
      </div>
      <TourForm action={updateTour} tour={tour} error={searchParams.error} />
    </div>
  );
}
