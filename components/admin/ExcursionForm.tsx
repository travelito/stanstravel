import type { Excursion } from "@/lib/data/excursions";
import { PhotoUploader } from "@/components/admin/PhotoUploader";

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
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-sm font-medium mb-3">Фото (до 10)</p>
        <PhotoUploader slug={excursion?.slug} entity="excursions" initialPhotos={excursion?.photos ?? []} />
      </div>

      <form action={action} className="flex flex-col gap-5">
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

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Highlights — что увидите (RU), один пункт на строку
            <textarea
              name="highlights_ru"
              rows={4}
              defaultValue={excursion?.highlights?.ru.join("\n")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Highlights (EN), один пункт на строку
            <textarea
              name="highlights_en"
              rows={4}
              defaultValue={excursion?.highlights?.en.join("\n")}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Itinerary — маршрут по точкам (RU), один пункт на строку, без времени
            <textarea
              name="itinerary_ru"
              rows={4}
              defaultValue={excursion?.itinerary?.ru.join("\n")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Itinerary (EN), один пункт на строку
            <textarea
              name="itinerary_en"
              rows={4}
              defaultValue={excursion?.itinerary?.en.join("\n")}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Included — включено (RU), один пункт на строку
            <textarea
              name="included_ru"
              rows={4}
              defaultValue={excursion?.included?.ru.join("\n")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Included (EN), один пункт на строку
            <textarea
              name="included_en"
              rows={4}
              defaultValue={excursion?.included?.en.join("\n")}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Not included — не включено (RU), один пункт на строку
            <textarea
              name="not_included_ru"
              rows={4}
              defaultValue={excursion?.notIncluded?.ru.join("\n")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Not included (EN), один пункт на строку
            <textarea
              name="not_included_en"
              rows={4}
              defaultValue={excursion?.notIncluded?.en.join("\n")}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <label className={labelClass}>
            Тип тура
            <select name="tour_type" defaultValue={excursion?.tourType ?? ""} className={inputClass}>
              <option value="">— не указано —</option>
              <option value="private">Private</option>
              <option value="group">Group</option>
            </select>
          </label>
          <label className={labelClass}>
            Язык гида
            <input
              type="text"
              name="guide_language"
              defaultValue={excursion?.guideLanguage ?? ""}
              placeholder="например, English, Russian"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Трансфер/пикап включён
            <select
              name="pickup_included"
              defaultValue={
                excursion?.pickupIncluded === true
                  ? "true"
                  : excursion?.pickupIncluded === false
                    ? "false"
                    : ""
              }
              className={inputClass}
            >
              <option value="">— не указано —</option>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
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
