import { createTrainTicket } from "@/app/admin/train-tickets/actions";
import { TrainTicketForm } from "@/components/admin/TrainTicketForm";

export default function NewTrainTicketPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Новый жд-билет</h1>
      <TrainTicketForm action={createTrainTicket} error={searchParams.error} />
    </div>
  );
}
