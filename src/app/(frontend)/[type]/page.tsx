import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { CoverImage } from '@/components/CoverImage'
import { FilterBar } from '@/components/FilterBar'
import { RatingBadge } from '@/components/RatingBadge'
import { ReviewPagination } from '@/components/ReviewPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPublishedDate } from '@/lib/format-date'
import {
  getWorkPath,
  isMediaTypeRoute,
  MEDIA_TYPE_LABELS,
  routeToMediaType,
  type MediaTypeRoute,
} from '@/lib/media-types'
import { parseReviewFilters, REVIEWS_PAGE_SIZE, TYPE_LISTING_FETCH_LIMIT } from '@/lib/review-filters'
import { getCoverUrl } from '@/lib/payload/cover'
import {
  getPopularTags,
  getReviewsByMediaType,
  getUniqueWorksFromReviews,
} from '@/lib/payload/queries'

type PageProps = {
  params: Promise<{ type: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateStaticParams() {
  const routes: MediaTypeRoute[] = ['anime', 'manga', 'tv', 'movie', 'games']
  return routes.map((type) => ({ type }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const mediaType = routeToMediaType(type)

  if (!mediaType) {
    return { title: 'EdArEview' }
  }

  return {
    title: MEDIA_TYPE_LABELS[mediaType],
    description: `Recensioni e schede ${MEDIA_TYPE_LABELS[mediaType].toLowerCase()} su EdArEview.`,
  }
}

export default async function MediaTypeListingPage({ params, searchParams }: PageProps) {
  const { type } = await params

  if (!isMediaTypeRoute(type)) {
    notFound()
  }

  const mediaType = routeToMediaType(type)
  if (!mediaType) notFound()

  const filters = parseReviewFilters(await searchParams, {
    mediaType,
    limit: TYPE_LISTING_FETCH_LIMIT,
  })
  const [tags, reviewsResult] = await Promise.all([
    getPopularTags(),
    getReviewsByMediaType(mediaType, filters),
  ])

  const allItems = await getUniqueWorksFromReviews(reviewsResult.docs)
  const page = filters.page ?? 1
  const totalPages = Math.max(1, Math.ceil(allItems.length / REVIEWS_PAGE_SIZE))
  const items = allItems.slice((page - 1) * REVIEWS_PAGE_SIZE, page * REVIEWS_PAGE_SIZE)
  const basePath = `/${type}`

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-muted-foreground text-sm">Catalogo</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {MEDIA_TYPE_LABELS[mediaType]}
        </h1>
      </div>

      <Suspense fallback={<div className="bg-muted/40 mb-8 h-40 animate-pulse rounded-lg border" />}>
        <FilterBar className="mb-8" tags={tags} />
      </Suspense>

      {allItems.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna recensione trovata in questa categoria.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ work, review }) => {
              const cover = getCoverUrl(work)
              const href = getWorkPath(work)

              return (
                <Card className="overflow-hidden transition-shadow hover:shadow-md" key={work.id}>
                  <Link className="block" href={href}>
                    <div className="bg-muted relative aspect-[2/3] w-full">
                      <CoverImage alt={work.title} src={cover} />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg">{work.title}</CardTitle>
                        <RatingBadge rating={review.rating} />
                      </div>
                      {work.year && (
                        <p className="text-muted-foreground text-sm">{work.year}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-2 text-sm">{review.title}</p>
                      {review.publishedAt && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          {formatPublishedDate(review.publishedAt)}
                        </p>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>

          <ReviewPagination
            basePath={basePath}
            filters={filters}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </main>
  )
}
