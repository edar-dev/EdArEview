import type { MediaType } from '@/lib/media-types'
import type { MediaWork, Review, Tag } from '@/payload-types'

export type SimilarReviewMatch = {
  review: Review
  score: number
}

function resolveMediaWork(review: Review): MediaWork | null {
  const work = review.mediaWork
  return typeof work === 'object' && work !== null ? work : null
}

function tagIds(review: Review | null): Set<number> {
  const ids = new Set<number>()

  for (const tag of review?.tags ?? []) {
    if (typeof tag === 'object' && tag !== null) {
      ids.add(tag.id)
    }
  }

  return ids
}

function genreNames(work: MediaWork | null): Set<string> {
  const names = new Set<string>()

  for (const entry of work?.genres ?? []) {
    if (entry.genre?.trim()) {
      names.add(entry.genre.trim().toLowerCase())
    }
  }

  return names
}

function scoreSimilarity(
  currentWork: MediaWork,
  currentReview: Review | null,
  candidate: Review,
): number {
  const candidateWork = resolveMediaWork(candidate)
  if (!candidateWork) return 0

  let score = 0

  if (candidateWork.mediaType === currentWork.mediaType) {
    score += 3
  }

  const currentTags = tagIds(currentReview)
  for (const tag of candidate.tags ?? []) {
    if (typeof tag === 'object' && tag !== null && currentTags.has(tag.id)) {
      score += 2
    }
  }

  const currentGenres = genreNames(currentWork)
  for (const genre of genreNames(candidateWork)) {
    if (currentGenres.has(genre)) {
      score += 1
    }
  }

  if (
    typeof currentReview?.rating === 'number' &&
    typeof candidate.rating === 'number' &&
    Math.abs(currentReview.rating - candidate.rating) <= 1.5
  ) {
    score += 2
  }

  if (currentWork.year && candidateWork.year && currentWork.year === candidateWork.year) {
    score += 1
  }

  return score
}

export function findSimilarReviews({
  currentWork,
  currentReview,
  candidates,
  limit = 4,
}: {
  currentWork: MediaWork
  currentReview: Review | null
  candidates: Review[]
  limit?: number
}): SimilarReviewMatch[] {
  const excludedReviewId = currentReview?.id ?? null

  return candidates
    .filter((candidate) => {
      if (excludedReviewId !== null && candidate.id === excludedReviewId) {
        return false
      }

      const work = resolveMediaWork(candidate)
      return work !== null && work.id !== currentWork.id
    })
    .map((review) => ({
      review,
      score: scoreSimilarity(currentWork, currentReview, review),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score

      const workA = resolveMediaWork(a.review)
      const workB = resolveMediaWork(b.review)
      const titleA = workA?.title ?? a.review.title
      const titleB = workB?.title ?? b.review.title

      return titleA.localeCompare(titleB, 'it')
    })
    .slice(0, limit)
}

export function similarMatchMediaTypeLabel(mediaType: MediaType): string {
  switch (mediaType) {
    case 'anime':
      return 'anime'
    case 'manga':
      return 'manga'
    case 'tv':
      return 'serie TV'
    case 'movie':
      return 'film'
    case 'game':
      return 'videogiochi'
    default:
      return 'opere'
  }
}
