import type { Metadata } from 'next'
import { Suspense } from 'react'

import { FilterBar } from '@/components/FilterBar'
import { ReviewCard } from '@/components/ReviewCard'
import { ReviewPagination } from '@/components/ReviewPagination'
import { parseReviewFilters } from '@/lib/review-filters'
import { getPopularTags, searchReviews } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Recensioni',
  description: 'Archivio cronologico delle recensioni pubblicate su EdArEview.',
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ReviewsArchivePage({ searchParams }: PageProps) {
  const filters = parseReviewFilters(await searchParams)
  const [tags, reviewsResult] = await Promise.all([getPopularTags(), searchReviews(filters)])
  const reviews = reviewsResult.docs
  const page = reviewsResult.page ?? filters.page ?? 1
  const totalPages = reviewsResult.totalPages ?? 0

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-muted-foreground text-sm">Archivio</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Recensioni</h1>
      </div>

      <Suspense fallback={<div className="bg-muted/40 mb-8 h-40 animate-pulse rounded-lg border" />}>
        <FilterBar className="mb-8" tags={tags} />
      </Suspense>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna recensione trovata con i filtri selezionati.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard compact key={review.id} review={review} />
            ))}
          </div>

          <ReviewPagination
            basePath="/reviews"
            filters={filters}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </main>
  )
}
