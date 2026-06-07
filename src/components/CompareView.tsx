import Link from 'next/link'

import { CoverImage } from '@/components/CoverImage'
import { RatingBadge } from '@/components/RatingBadge'
import { sharedGenres, sharedTagNames } from '@/lib/compare-works'
import { getWorkPath, MEDIA_TYPE_LABELS } from '@/lib/media-types'
import { getCoverUrl } from '@/lib/payload/cover'
import type { MediaWork, Review } from '@/payload-types'

type ComparePanelProps = {
  work: MediaWork
  review: Review | null
  label: string
}

function ComparePanel({ work, review, label }: ComparePanelProps) {
  const href = getWorkPath(work)
  const cover = getCoverUrl(work)

  return (
    <article className="bg-card overflow-hidden rounded-xl border">
      <Link className="block" href={href}>
        <div className="bg-muted relative aspect-[2/3] w-full">
          <CoverImage alt={work.title} className="object-cover" src={cover} />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.15em]">{label}</p>
        <h2 className="text-xl font-semibold">
          <Link className="hover:underline" href={href}>
            {work.title}
          </Link>
        </h2>
        <p className="text-muted-foreground text-sm">
          {MEDIA_TYPE_LABELS[work.mediaType]}
          {work.year ? ` · ${work.year}` : ''}
        </p>
        {review ? (
          <div className="flex items-center gap-2">
            <RatingBadge rating={review.rating} />
            <span className="text-muted-foreground text-sm">{review.title}</span>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Nessuna recensione pubblicata.</p>
        )}
        {(work.genres?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2">
            {work.genres?.map((entry) => (
              <span className="bg-secondary rounded-full px-2 py-1 text-xs" key={entry.id ?? entry.genre}>
                {entry.genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

type CompareViewProps = {
  workA: MediaWork
  reviewA: Review | null
  workB: MediaWork
  reviewB: Review | null
}

export function CompareView({ workA, reviewA, workB, reviewB }: CompareViewProps) {
  const genres = sharedGenres(workA, workB)
  const tags = sharedTagNames(reviewA, reviewB)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <ComparePanel label="Opera A" review={reviewA} work={workA} />
        <ComparePanel label="Opera B" review={reviewB} work={workB} />
      </div>

      {(genres.length > 0 || tags.length > 0) && (
        <section className="bg-card rounded-xl border p-5">
          <h2 className="mb-4 text-lg font-semibold">In comune</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {genres.length > 0 && (
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm">Generi</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span className="bg-secondary rounded-full px-2 py-1 text-xs" key={genre}>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm">Tag recensioni</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span className="bg-secondary rounded-full px-2 py-1 text-xs" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
