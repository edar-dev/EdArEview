import type { MediaType } from '@/lib/media-types'
import { MEDIA_TYPES, MEDIA_TYPE_LABELS } from '@/lib/media-types'
import type { MediaWork, Review, Tag } from '@/payload-types'

export type MediaTypeStat = {
  mediaType: MediaType
  label: string
  count: number
  averageRating: number | null
}

export type YearStat = {
  year: number
  count: number
}

export type TagStat = {
  tag: Tag
  count: number
}

export type ReviewStatistics = {
  totalReviews: number
  averageRating: number | null
  byMediaType: MediaTypeStat[]
  byPublishedYear: YearStat[]
  byWorkYear: YearStat[]
  topTags: TagStat[]
  availablePublishedYears: number[]
}

function resolveMediaWork(review: Review): MediaWork | null {
  const work = review.mediaWork
  return typeof work === 'object' && work !== null ? work : null
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
}

export function computeReviewStatistics(reviews: Review[]): ReviewStatistics {
  const ratings: number[] = []
  const publishedYearCounts = new Map<number, number>()
  const workYearCounts = new Map<number, number>()
  const tagCounts = new Map<number, { tag: Tag; count: number }>()

  for (const review of reviews) {
    if (typeof review.rating === 'number') {
      ratings.push(review.rating)
    }

    const work = resolveMediaWork(review)
    if (work?.year) {
      workYearCounts.set(work.year, (workYearCounts.get(work.year) ?? 0) + 1)
    }

    if (review.publishedAt) {
      const year = new Date(review.publishedAt).getFullYear()
      publishedYearCounts.set(year, (publishedYearCounts.get(year) ?? 0) + 1)
    }

    for (const tag of review.tags ?? []) {
      if (typeof tag !== 'object' || tag === null) continue
      const existing = tagCounts.get(tag.id)
      if (existing) {
        existing.count += 1
      } else {
        tagCounts.set(tag.id, { tag, count: 1 })
      }
    }
  }

  const byMediaType = MEDIA_TYPES.map((mediaType) => {
    const matching = reviews.filter((review) => {
      const work = resolveMediaWork(review)
      return work?.mediaType === mediaType
    })
    const typeRatings = matching
      .map((review) => review.rating)
      .filter((rating): rating is number => typeof rating === 'number')

    return {
      mediaType,
      label: MEDIA_TYPE_LABELS[mediaType],
      count: matching.length,
      averageRating: average(typeRatings),
    }
  }).filter((entry) => entry.count > 0)

  const sortYearDesc = (a: YearStat, b: YearStat) => b.year - a.year

  const byPublishedYear = [...publishedYearCounts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort(sortYearDesc)

  const byWorkYear = [...workYearCounts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort(sortYearDesc)

  const topTags = [...tagCounts.values()]
    .sort((a, b) => b.count - a.count || a.tag.name.localeCompare(b.tag.name))
    .slice(0, 12)

  return {
    totalReviews: reviews.length,
    averageRating: average(ratings),
    byMediaType,
    byPublishedYear,
    byWorkYear,
    topTags,
    availablePublishedYears: byPublishedYear.map((entry) => entry.year),
  }
}

export function filterReviewsByPublishedYear(
  reviews: Review[],
  year: number | null,
): Review[] {
  if (!year) return reviews

  return reviews.filter((review) => {
    if (!review.publishedAt) return false
    return new Date(review.publishedAt).getFullYear() === year
  })
}
