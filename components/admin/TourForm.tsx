import type { Tour } from "@/lib/data/tours";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { PricingFields } from "@/components/admin/PricingFields";

const inputClass = "border border-ink/20 rounded-md px-3 py-2 bg-white w-full";
const labelClass = "flex flex-col gap-1 text-sm";

export function TourForm({
  action,
  tour,
  error,
}: {
  action: (formData: FormData) => void;
  tour?: Tour;
  error?: string;
}) {
  const isEdit = Boolean(tour);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-sm font-medium mb-3">Фото (до 10)</p>
        <PhotoUploader slug={tour?.slug} entity="tours" initialPhotos={tour?.photos ?? []} />
      </div>

      <form action={action} className="flex flex-col gap-5">
      <label className={labelClass}>
        Slug (латиница, дефисы; часть URL, не меняется после создания)
        <input
          type="text"
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={tour?.slug}
          readOnly={isEdit}
          className={`${inputClass} ${isEdit ? "bg-plaster text-ink/60" : ""}`}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Город
          <input type="text" name="city" required defaultValue={tour?.city} className={inputClass} />
        </label>
        <label className={labelClass}>
          Длительность
          <input
            type="number"
            name="duration_value"
            required
            min={0}
            step="0.5"
            defaultValue={tour?.duration.value}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Единица длительности
        <select
          name="duration_unit"
          defaultValue={tour?.duration.unit ?? "hours"}
          className={`${inputClass} max-w-xs`}
        >
          <option value="hours">часы</option>
          <option value="days">дни</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Заголовок (RU)
          <input type="text" name="title_ru" required defaultValue={tour?.title.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (EN)
          <input type="text" name="title_en" required defaultValue={tour?.title.en} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Краткое описание (RU)
          <textarea name="summary_ru" required rows={2} defaultValue={tour?.summary.ru} className={inputClass} />
        </label>
        <label className={labelClass}>
          Краткое описание (EN)
          <textarea name="summary_en" required rows={2} defaultValue={tour?.summary.en} className={inputClass} />
        </label>
      </div>

      <PricingFields
        defaultModel={tour?.pricingModel ?? "per_person"}
        defaultPricePerPerson={tour?.pricingModel === "group" ? 0 : (tour?.priceUsd ?? 0)}
        defaultTiers={tour?.priceTiers ?? []}
      />

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Описание, абзацы (RU) — один абзац на строку
          <textarea
            name="description_ru"
            rows={6}
            defaultValue={tour?.description.ru.join("\n")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Описание, абзацы (EN) — один абзац на строку
          <textarea
            name="description_en"
            rows={6}
            defaultValue={tour?.description.en.join("\n")}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          Что вы увидите (RU) — один пункт на строку
          <textarea
            name="highlights_ru"
            rows={4}
            defaultValue={tour?.highlights.ru.join("\n")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Что вы увидите (EN) — один пункт на строку
          <textarea
            name="highlights_en"
            rows={4}
            defaultValue={tour?.highlights.en.join("\n")}
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
            defaultValue={tour?.itinerary?.ru.join("\n")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Itinerary (EN), один пункт на строку
          <textarea
            name="itinerary_en"
            rows={4}
            defaultValue={tour?.itinerary?.en.join("\n")}
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
            defaultValue={tour?.included?.ru.join("\n")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Included (EN), один пункт на строку
          <textarea
            name="included_en"
            rows={4}
            defaultValue={tour?.included?.en.join("\n")}
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
            defaultValue={tour?.notIncluded?.ru.join("\n")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Not included (EN), один пункт на строку
          <textarea
            name="not_included_en"
            rows={4}
            defaultValue={tour?.notIncluded?.en.join("\n")}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <label className={labelClass}>
          Тип тура
          <select name="tour_type" defaultValue={tour?.tourType ?? ""} className={inputClass}>
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
            defaultValue={tour?.guideLanguage ?? ""}
            placeholder="например, English, Russian"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Трансфер/пикап включён
          <select
            name="pickup_included"
            defaultValue={
              tour?.pickupIncluded === true ? "true" : tour?.pickupIncluded === false ? "false" : ""
            }
            className={inputClass}
          >
            <option value="">— не указано —</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </label>
        <label className={labelClass}>
          Формат перемещения
          <select name="tour_pace" defaultValue={tour?.tourPace ?? ""} className={inputClass}>
            <option value="">— не указано —</option>
            <option value="walking">Пешая</option>
            <option value="transport">На транспорте</option>
            <option value="mixed">Смешанная</option>
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
