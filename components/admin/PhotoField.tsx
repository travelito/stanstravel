export function PhotoField({ currentImage }: { currentImage?: string | null }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      {currentImage && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImage} alt="Текущее фото" className="h-24 w-32 object-cover rounded-md" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="remove_photo" value="1" />
            Удалить текущее фото
          </label>
        </div>
      )}
      <label className="flex flex-col gap-1">
        {currentImage ? "Заменить фото" : "Фото"}
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          className="border border-ink/20 rounded-md px-3 py-2 bg-white w-full"
        />
      </label>
    </div>
  );
}
