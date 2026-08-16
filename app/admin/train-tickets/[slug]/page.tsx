import { notFound } from "next/navigation";
import { getTrainTicketBySlug } from "@/lib/data/train-tickets";
import { updateTrainTicket, deleteTrainTicket } from "@/app/admin/train-tickets/actions";
import { TrainTicketForm } from "@/components/admin/TrainTicketForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export default async function EditTrainTicketPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { error?: string };
}) {
  const ticket = await getTrainTicketBySlug(params.slug);
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Билет: {ticket.title.ru}</h1>
        <form action={deleteTrainTicket}>
          <input type="hidden" name="slug" value={ticket.slug} />
          <ConfirmSubmitButton
            confirmMessage={`Удалить билет «${ticket.title.ru}»?`}
            className="text-red-700 hover:text-red-900 text-sm"
          >
            Удалить
          </ConfirmSubmitButton>
        </form>
      </div>
      <TrainTicketForm action={updateTrainTicket} ticket={ticket} error={searchParams.error} />
    </div>
  );
}
