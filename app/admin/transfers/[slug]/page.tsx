import { notFound } from "next/navigation";
import { getTransferBySlug } from "@/lib/data/transfers";
import { updateTransfer, deleteTransfer } from "@/app/admin/transfers/actions";
import { TransferForm } from "@/components/admin/TransferForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export default async function EditTransferPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { error?: string };
}) {
  const transfer = await getTransferBySlug(params.slug);
  if (!transfer) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Трансфер: {transfer.title.ru}</h1>
        <form action={deleteTransfer}>
          <input type="hidden" name="slug" value={transfer.slug} />
          <ConfirmSubmitButton
            confirmMessage={`Удалить трансфер «${transfer.title.ru}»?`}
            className="text-red-700 hover:text-red-900 text-sm"
          >
            Удалить
          </ConfirmSubmitButton>
        </form>
      </div>
      <TransferForm action={updateTransfer} transfer={transfer} error={searchParams.error} />
    </div>
  );
}
