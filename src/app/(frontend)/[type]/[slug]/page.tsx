import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaWorkHeader } from '@/components/MediaWorkHeader'
import { RatingBadge } from '@/components/RatingBadge'
import { RichText } from '@/components/RichText'
import { SimilarReviewsSection } from '@/components/SimilarReviewsSection'
import { SpoilerBanner } from '@/components/SpoilerBanner'
import { formatPublishedDate } from '@/lib/format-date'
import { isMediaTypeRoute, routeToMediaType } from '@/lib/media-types'
import { buildOgImageUrl } from '@/lib/og'
import { getCoverUrl } from '@/lib/payload/cover'
import { getMediaWorkBySlug, getSimilarReviewsForWork } from '@/lib/payload/queries'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

type PageProps = {
  params: Promise<{ type: string; slug: string }>
}

const WATCH_STATUS_LABELS: Record<string, string> = {
  planned: 'In programma',
  watching: 'In corso',
  completed: 'Completato',
  dropped: 'Abbandonato',
  on_hold: 'In pausa',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, slug } = await params
  const mediaType = isMediaTypeRoute(type) ? routeToMediaType(type) : null

  if (!mediaType) {
    return { title: 'EdArEview' }
  }

  const result = await getMediaWorkBySlug(mediaType, slug)
  if (!result) {
    return { title: 'Non trovato | EdArEview' }
  }

  const { work, review } = result
  const description = review?.body
    ? convertLexicalToPlaintext({ data: review.body }).slice(0, 160)
    : `Scheda di ${work.title} su EdArEview.`

  const cover = getCoverUrl(work)
  const ogImage = buildOgImageUrl({
    title: work.title,
    rating: review?.rating,
    mediaType,
    cover,
  })

  return {
    title: `${work.title} — Recensione`,
    description,
    openGraph: {
      title: `${work.title} — Recensione`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: work.title }],
    },
  }
}

export default async function MediaWorkDetailPage({ params }: PageProps) {
  const { type, slug } = await params

  if (!isMediaTypeRoute(type)) {
    notFound()
  }

  const mediaType = routeToMediaType(type)
  if (!mediaType) notFound()

  const result = await getMediaWorkBySlug(mediaType, slug)
  if (!result) notFound()

  const { work, review } = result
  const similarReviews = await getSimilarReviewsForWork(work, review)

  const reviewBody = review ? (
    review.hasSpoilers ? (
      <SpoilerBanner>
        <RichText data={review.body} />
      </SpoilerBanner>
    ) : (
      <RichText data={review.body} />
    )
  ) : null

  return (
    <main className="container py-10 md:py-14">
      <MediaWorkHeader work={work} />

      <section className="mt-12 space-y-6">
        {review ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">{review.title}</h2>
              <RatingBadge rating={review.rating} />
              {review.watchStatus && (
                <span className="bg-secondary rounded-full px-3 py-1 text-xs">
                  {WATCH_STATUS_LABELS[review.watchStatus] ?? review.watchStatus}
                </span>
              )}
            </div>
            {review.publishedAt && (
              <p className="text-muted-foreground text-sm">
                Pubblicata il {formatPublishedDate(review.publishedAt)}
              </p>
            )}
            {reviewBody}
          </>
        ) : (
          <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            Scheda pubblicata, recensione non ancora disponibile.
          </p>
        )}
      </section>

      <SimilarReviewsSection reviews={similarReviews} work={work} />
    </main>
  )
}
