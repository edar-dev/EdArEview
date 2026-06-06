import type { Metadata } from 'next'

import { ReviewCard } from '@/components/ReviewCard'
import { getPublishedReviews } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Recensioni | EdArEview',
  description: 'Archivio cronologico delle recensioni pubblicate su EdArEview.',
}

export default async function ReviewsArchivePage() {
  const reviewsResult = await getPublishedReviews(50)
  const reviews = reviewsResult.docs

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-muted-foreground text-sm">Archivio</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Recensioni</h1>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna recensione pubblicata.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard compact key={review.id} review={review} />
          ))}
        </div>
      )}
    </main>
  )
}
