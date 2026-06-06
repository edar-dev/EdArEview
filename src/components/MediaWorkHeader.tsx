import { CoverImage } from '@/components/CoverImage'
import { MEDIA_TYPE_LABELS } from '@/lib/media-types'
import { getCoverUrl } from '@/lib/payload/cover'
import type { MediaWork } from '@/payload-types'

export function MediaWorkHeader({ work }: { work: MediaWork }) {
  const cover = getCoverUrl(work)
  const genres = work.genres?.map((item) => item.genre).filter(Boolean) ?? []

  return (
    <section className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="bg-muted relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-lg">
        <CoverImage alt={work.title} className="object-cover" priority src={cover} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">{MEDIA_TYPE_LABELS[work.mediaType]}</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{work.title}</h1>
          {work.titleOriginal && work.titleOriginal !== work.title && (
            <p className="text-muted-foreground mt-1 text-lg">{work.titleOriginal}</p>
          )}
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {work.year && (
            <div>
              <dt className="text-muted-foreground">Anno</dt>
              <dd>{work.year}</dd>
            </div>
          )}
          {work.externalSource !== 'manual' && work.externalId && (
            <div>
              <dt className="text-muted-foreground">Fonte</dt>
              <dd className="uppercase">{work.externalSource}</dd>
            </div>
          )}
        </dl>

        {genres.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <li
                className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs"
                key={genre}
              >
                {genre}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
