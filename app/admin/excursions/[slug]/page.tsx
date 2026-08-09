import { notFound } from "next/navigation";
import { getExcursionBySlug } from "@/lib/data/excursions";
import { updateExcursion, deleteExcursion } from "@/app/admin/excursions/actions";
import { ExcursionForm } from "@/components/admin/ExcursionForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export default async function EditExcursionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { error?: string };
}) {
  const excursion = await getExcursionBySlug(params.slug);
  if (!excursion) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Экскурсия: {excursion.title.ru}</h1>
        <form action={deleteExcursion}>
          <input type="hidden" name="slug" value={excursion.slug} />
          <ConfirmSubmitButton
            confirmMessage={`Удалить экскурсию «${excursion.title.ru}»?`}
            className="text-red-700 hover:text-red-900 text-sm"
          >
            Удалить
          </ConfirmSubmitButton>
        </form>
      </div>
      <ExcursionForm action={updateExcursion} excursion={excursion} error={searchParams.error} />
    </div>
  );
}
