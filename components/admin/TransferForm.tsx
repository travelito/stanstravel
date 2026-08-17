import type { Transfer } from "@/lib/data/transfers";
import { PhotoUploader } from "@/components/admin/PhotoUploader";

const inputClass = "border border-ink/20 rounded-md px-3 py-2 bg-white w-full";
const labelClass = "flex flex-col gap-1 text-sm";

export function TransferForm({
  action,
  transfer,
  error,
}: {
  action: (formData: FormData) => void;
  transfer?: Transfer;
  error?: string;
}) {
  const isEdit = Boolean(transfer);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-sm font-medium mb-3">Фото (до 10)</p>
        <PhotoUploader slug={transfer?.slug} entity="transfers" initialPhotos={transfer?.photos ?? []} />
      </div>

      <form action={action} className="flex flex-col gap-5">
      <label className={labelClass}>
        Slug (латиница, дефисы; часть URL, не меняется после создания)
        <input
          type="text"
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={transfer?.slug}
          readOnly={isEdit}
          className={`${inputClass} ${isEdit ? "bg-plaster text-ink/60" : ""}`}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Откуда
          <input type="text" name="from_city" required defaultValue={transfer?.fromCity} className={inputClass} />
        </label>
        <label className={labelClass}>
          Куда
          <input type="text" name="to_city" required defaultValue={transfer?.toCity} className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        Тип транспорта
        <input
          type="text"
          name="transport_type"
          required
          defaultValue={transfer?.transportType}
          className={inputClass}
        />
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
            defaultValue={transfer?.priceUsd}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Длительность, часы
          <input
            type="number"
            name="duration_hours"
            required
            min={0}
            step="0.5"
            defaultValue={transfer?.durationHours}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Заголовок (RU)
          <input type="text" name="title_ru" required defaultValue={transfer?.title.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (EN)
          <input type="text" name="title_en" required defaultValue={transfer?.title.en} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Описание (RU)
          <textarea
            name="summary_ru"
            required
            rows={2}
            defaultValue={transfer?.summary.ru}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Описание (EN)
          <textarea
            name="summary_en"
            required
            rows={2}
            defaultValue={transfer?.summary.en}
            className={inputClass}
          />
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
    </div>
  );
}
