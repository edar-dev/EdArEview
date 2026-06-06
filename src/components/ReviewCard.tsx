import Link from 'next/link'

import { CoverImage } from '@/components/CoverImage'
import { RatingBadge } from '@/components/RatingBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPublishedDate } from '@/lib/format-date'
import { getWorkPath, MEDIA_TYPE_LABELS } from '@/lib/media-types'
import { getCoverUrl } from '@/lib/payload/cover'
import type { MediaWork, Review } from '@/payload-types'

type ReviewCardProps = {
  review: Review
  compact?: boolean
}

function resolveMediaWork(review: Review): MediaWork | null {
  const work = review.mediaWork
  return typeof work === 'object' && work !== null ? work : null
}

export function ReviewCard({ review, compact = false }: ReviewCardProps) {
  const work = resolveMediaWork(review)
  if (!work) return null

  const href = getWorkPath(work)
  const cover = getCoverUrl(work)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link className="block" href={href}>
        <div className="bg-muted relative aspect-[2/3] w-full">
          <CoverImage alt={work.title} className="object-cover" src={cover} />
        </div>
        <CardHeader className={compact ? 'p-4 pb-2' : undefined}>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className={compact ? 'text-base' : 'text-lg'}>{review.title}</CardTitle>
            <RatingBadge rating={review.rating} />
          </div>
          <p className="text-muted-foreground text-sm">
            {work.title}
            {work.year ? ` · ${work.year}` : ''}
          </p>
        </CardHeader>
        <CardContent className={compact ? 'px-4 pb-4 pt-0' : 'pt-0'}>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-secondary rounded-full px-2 py-1">
              {MEDIA_TYPE_LABELS[work.mediaType]}
            </span>
            {review.publishedAt && <span>{formatPublishedDate(review.publishedAt)}</span>}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
