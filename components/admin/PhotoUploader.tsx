"use client";

import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/auth/supabase-browser";
import { compressToWebp } from "@/lib/photo-compress";
import { uploadListingPhoto, photoPublicUrl, ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE, type Photo } from "@/lib/storage";
import { addTourPhoto, removeTourPhoto, reorderTourPhoto } from "@/app/admin/tours/photos";
import { addExcursionPhoto, removeExcursionPhoto, reorderExcursionPhoto } from "@/app/admin/excursions/photos";

type PendingFile = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
  message?: string;
};

const SIZES: { key: keyof Photo; maxDimension: number; quality: number }[] = [
  { key: "thumb", maxDimension: 320, quality: 0.75 },
  { key: "medium", maxDimension: 900, quality: 0.8 },
  { key: "full", maxDimension: 1920, quality: 0.85 },
];

const MAX_PHOTOS = 10;
const CONCURRENCY = 3;

export function PhotoUploader({
  slug,
  entity,
  initialPhotos,
}: {
  slug?: string;
  entity: "tours" | "excursions";
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const countRef = useRef(initialPhotos.length);

  const addPhotoAction = entity === "tours" ? addTourPhoto : addExcursionPhoto;
  const removePhotoAction = entity === "tours" ? removeTourPhoto : removeExcursionPhoto;
  const reorderPhotoAction = entity === "tours" ? reorderTourPhoto : reorderExcursionPhoto;

  const processFile = useCallback(
    async (file: File, id: string) => {
      try {
        if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
          throw new Error("Формат не поддерживается — только JPEG, PNG или WebP");
        }
        if (file.size > MAX_PHOTO_SIZE) {
          throw new Error("Файл больше 5 МБ");
        }

        const supabase = createClient();
        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const entries = await Promise.all(
          SIZES.map(async ({ key, maxDimension, quality }) => {
            const blob = await compressToWebp(file, maxDimension, quality);
            const path = `${entity}/${slug}/${stamp}-${key}.webp`;
            await uploadListingPhoto(supabase, path, blob);
            return [key, path] as const;
          })
        );
        const paths = Object.fromEntries(entries) as Photo;

        const result = await addPhotoAction(slug!, paths);
        if (result.error) throw new Error(result.error);

        setPhotos((prev) => [
          ...prev,
          {
            thumb: photoPublicUrl(paths.thumb),
            medium: photoPublicUrl(paths.medium),
            full: photoPublicUrl(paths.full),
          },
        ]);
        setPending((prev) => prev.map((p) => (p.id === id ? { ...p, status: "done" } : p)));
      } catch (e) {
        setPending((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "error", message: (e as Error).message } : p))
        );
      }
    },
    [slug, entity, addPhotoAction]
  );

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (!slug) return;
      const files = Array.from(fileList);
      const remaining = Math.max(0, MAX_PHOTOS - countRef.current);
      const accepted = files.slice(0, remaining);
      const rejectedCount = files.length - accepted.length;

      setLimitWarning(
        rejectedCount > 0
          ? `Лимит 10 фото на запись — загружено ${accepted.length} из ${files.length}, остальные пропущены.`
          : null
      );

      if (accepted.length === 0) return;
      countRef.current += accepted.length;

      const newPending: PendingFile[] = accepted.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        status: "uploading",
      }));
      setPending((prev) => [...prev, ...newPending]);

      let next = 0;
      const runNext = () => {
        if (next >= accepted.length) return;
        const i = next++;
        processFile(accepted[i], newPending[i].id).finally(runNext);
      };
      for (let c = 0; c < CONCURRENCY; c++) runNext();
    },
    [processFile, slug]
  );

  const handleRemove = async (index: number) => {
    if (!slug) return;
    if (!window.confirm("Удалить это фото?")) return;
    const result = await removePhotoAction(slug, index);
    if (result.error) {
      window.alert(`Не удалось удалить: ${result.error}`);
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    countRef.current -= 1;
    setLimitWarning(null);
  };

  const handleMove = async (from: number, to: number) => {
    if (!slug || to < 0 || to >= photos.length || from === to) return;
    const prev = photos;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPhotos(next);

    const result = await reorderPhotoAction(slug, from, to);
    if (result.error) {
      setPhotos(prev);
      window.alert(`Не удалось изменить порядок: ${result.error}`);
    }
  };

  if (!slug) {
    return (
      <p className="text-sm text-ink/60 border border-dashed border-ink/20 rounded-md px-4 py-6 text-center">
        Сначала сохраните тур — фото можно будет загрузить сразу после этого.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {photos.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div
              key={photo.thumb + i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) handleMove(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className="relative group cursor-grab active:cursor-grabbing"
            >
              <img src={photo.thumb} alt="" className="h-20 w-full object-cover rounded-md" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                aria-label="Удалить фото"
                className="absolute -top-2 -right-2 bg-ink text-plaster rounded-full h-6 w-6 text-xs leading-6 text-center hover:bg-red-700"
              >
                ×
              </button>
              <div className="absolute bottom-1 inset-x-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => handleMove(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Сдвинуть влево"
                  className="bg-ink text-plaster rounded-full h-5 w-5 text-xs leading-5 text-center hover:bg-turquoise disabled:opacity-30 disabled:hover:bg-ink"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(i, i + 1)}
                  disabled={i === photos.length - 1}
                  aria-label="Сдвинуть вправо"
                  className="bg-ink text-plaster rounded-full h-5 w-5 text-xs leading-5 text-center hover:bg-turquoise disabled:opacity-30 disabled:hover:bg-ink"
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-md px-4 py-6 text-center text-sm transition-colors ${
          dragOver ? "border-turquoise bg-turquoise/5" : "border-ink/20"
        }`}
      >
        <p className="text-ink/60 mb-2">Перетащите фото сюда или выберите файлы</p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="text-sm"
        />
      </div>

      {limitWarning && <p className="text-sm text-clay">{limitWarning}</p>}

      {pending.length > 0 && (
        <ul className="text-sm flex flex-col gap-1">
          {pending.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="truncate max-w-xs">{p.name}</span>
              {p.status === "uploading" && <span className="text-ink/50">Загружается…</span>}
              {p.status === "done" && <span className="text-turquoise">Готово</span>}
              {p.status === "error" && <span className="text-red-700">Ошибка: {p.message}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
