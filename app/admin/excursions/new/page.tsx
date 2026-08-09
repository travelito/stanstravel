import { createExcursion } from "@/app/admin/excursions/actions";
import { ExcursionForm } from "@/components/admin/ExcursionForm";

export default function NewExcursionPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Новая экскурсия</h1>
      <ExcursionForm action={createExcursion} error={searchParams.error} />
    </div>
  );
}
