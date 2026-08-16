import { createTransfer } from "@/app/admin/transfers/actions";
import { TransferForm } from "@/components/admin/TransferForm";

export default function NewTransferPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Новый трансфер</h1>
      <TransferForm action={createTransfer} error={searchParams.error} />
    </div>
  );
}
