import { ReviewCard } from '@/components/ReviewCard'
import { similarMatchMediaTypeLabel } from '@/lib/similar-reviews'
import type { MediaWork, Review } from '@/payload-types'

type SimilarReviewsSectionProps = {
  work: MediaWork
  reviews: Review[]
}

export function SimilarReviewsSection({ work, reviews }: SimilarReviewsSectionProps) {
  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-12">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold">Opere simili</h2>
        <p className="text-muted-foreground text-sm">
          Suggerimenti basati su tag, generi, voto e tipo ({similarMatchMediaTypeLabel(work.mediaType)}).
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <ReviewCard compact key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}
