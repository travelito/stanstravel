/**
 * Embeds an unlisted/public YouTube video. YouTube handles all encoding,
 * adaptive bitrate, and bandwidth — our hosting never touches the video
 * file itself, which is what keeps the site fast even with many videos.
 *
 * Usage: <VideoEmbed youtubeId="dQw4w9WgXcQ" title="Samarkand tour preview" />
 */
export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-ink/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
