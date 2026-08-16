import type { TrainTicket } from "@/lib/data/train-tickets";

const inputClass = "border border-ink/20 rounded-md px-3 py-2 bg-white w-full";
const labelClass = "flex flex-col gap-1 text-sm";

export function TrainTicketForm({
  action,
  ticket,
  error,
}: {
  action: (formData: FormData) => void;
  ticket?: TrainTicket;
  error?: string;
}) {
  const isEdit = Boolean(ticket);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <label className={labelClass}>
        Slug (латиница, дефисы; часть URL, не меняется после создания)
        <input
          type="text"
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={ticket?.slug}
          readOnly={isEdit}
          className={`${inputClass} ${isEdit ? "bg-plaster text-ink/60" : ""}`}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Откуда
          <input type="text" name="from_city" required defaultValue={ticket?.fromCity} className={inputClass} />
        </label>
        <label className={labelClass}>
          Куда
          <input type="text" name="to_city" required defaultValue={ticket?.toCity} className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        Тип поезда
        <input type="text" name="train" required defaultValue={ticket?.train} className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Цена, $
          <input
            type="number"
            name="price_usd"
            required
            min={0}
            step="1"
            defaultValue={ticket?.priceUsd}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Время в пути, часы
          <input
            type="number"
            name="duration_hours"
            required
            min={0}
            step="0.5"
            defaultValue={ticket?.durationHours}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Заголовок (RU)
          <input type="text" name="title_ru" required defaultValue={ticket?.title.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (EN)
          <input type="text" name="title_en" required defaultValue={ticket?.title.en} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Описание (RU)
          <textarea name="summary_ru" required rows={2} defaultValue={ticket?.summary.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Описание (EN)
          <textarea name="summary_en" required rows={2} defaultValue={ticket?.summary.en} className={inputClass} />
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        className="mt-2 self-start bg-indigo text-plaster px-5 py-2 rounded-md hover:bg-turquoise transition-colors"
      >
        {isEdit ? "Сохранить" : "Создать"}
      </button>
    </form>
  );
}
