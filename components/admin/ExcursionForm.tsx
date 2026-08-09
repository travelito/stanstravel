import type { Excursion } from "@/lib/data/excursions";
import { PhotoField } from "@/components/admin/PhotoField";

const inputClass = "border border-ink/20 rounded-md px-3 py-2 bg-white w-full";
const labelClass = "flex flex-col gap-1 text-sm";

export function ExcursionForm({
  action,
  excursion,
  error,
}: {
  action: (formData: FormData) => void;
  excursion?: Excursion;
  error?: string;
}) {
  const isEdit = Boolean(excursion);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <label className={labelClass}>
        Slug (латиница, дефисы; часть URL, не меняется после создания)
        <input
          type="text"
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={excursion?.slug}
          readOnly={isEdit}
          className={`${inputClass} ${isEdit ? "bg-plaster text-ink/60" : ""}`}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Город
          <input type="text" name="city" required defaultValue={excursion?.city} className={inputClass} />
        </label>
        <label className={labelClass}>
          Цена, $
          <input
            type="number"
            name="price_usd"
            required
            min={0}
            step="1"
            defaultValue={excursion?.priceUsd}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Длительность, часы
        <input
          type="number"
          name="duration_hours"
          required
          min={0}
          step="0.5"
          defaultValue={excursion?.durationHours}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Заголовок (RU)
          <input type="text" name="title_ru" required defaultValue={excursion?.title.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (EN)
          <input type="text" name="title_en" required defaultValue={excursion?.title.en} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Краткое описание (RU)
          <textarea
            name="summary_ru"
            required
            rows={2}
            defaultValue={excursion?.summary.ru}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Краткое описание (EN)
          <textarea
            name="summary_en"
            required
            rows={2}
            defaultValue={excursion?.summary.en}
            className={inputClass}
          />
        </label>
      </div>

      <PhotoField currentImage={excursion?.image} />

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
