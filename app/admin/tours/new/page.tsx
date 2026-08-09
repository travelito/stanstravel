import { createTour } from "@/app/admin/tours/actions";
import { TourForm } from "@/components/admin/TourForm";

export default function NewTourPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Новый тур</h1>
      <TourForm action={createTour} error={searchParams.error} />
    </div>
  );
}
