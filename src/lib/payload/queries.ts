import type { Where } from 'payload'

import type { MediaType } from '@/lib/media-types'
import { computeReviewStatistics, filterReviewsByPublishedYear } from '@/lib/review-stats'
import {
  REVIEWS_PAGE_SIZE,
  TYPE_LISTING_FETCH_LIMIT,
  type ReviewFilters,
  type ReviewSort,
} from '@/lib/review-filters'
import type { MediaWork, EditorialList, Review, SiteSetting, Tag } from '@/payload-types'

import { getPayloadClient } from './client'

const publishedReviewWhere = {
  status: {
    equals: 'published' as const,
  },
}

function sortForReviewFilters(sort: ReviewSort = 'date'): string {
  switch (sort) {
    case 'rating':
      return '-rating'
    case 'title':
      return 'title'
    default:
      return '-publishedAt'
  }
}

async function resolveTagId(slug: string): Promise<number | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  return result.docs[0]?.id ?? null
}

const emptyReviewWhere: Where = { id: { equals: -1 } }

function buildMediaWorkWhere(filters: ReviewFilters): Where | null {
  const workAnd: Where[] = [{ status: { equals: 'published' } }]

  if (filters.mediaType) {
    workAnd.push({ mediaType: { equals: filters.mediaType } })
  }

  if (filters.year && filters.year > 0) {
    workAnd.push({ year: { equals: filters.year } })
  }

  if (workAnd.length === 1) {
    return null
  }

  return { and: workAnd }
}

async function resolvePublishedMediaWorkIds(filters: ReviewFilters): Promise<number[] | null> {
  const mediaWorkWhere = buildMediaWorkWhere(filters)
  if (!mediaWorkWhere) return null

  const payload = await getPayloadClient()
  const works = await payload.find({
    collection: 'media-works',
    where: mediaWorkWhere,
    limit: 1000,
    depth: 0,
  })

  return works.docs.map((work) => work.id)
}

async function buildReviewWhere(filters: ReviewFilters): Promise<Where> {
  const and: Where[] = [publishedReviewWhere]

  if (filters.minRating && filters.minRating > 0) {
    and.push({ rating: { greater_than_equal: filters.minRating } })
  }

  if (filters.status) {
    and.push({ watchStatus: { equals: filters.status } })
  }

  const scopedMediaWorkIds = await resolvePublishedMediaWorkIds(filters)
  if (scopedMediaWorkIds) {
    if (scopedMediaWorkIds.length === 0) {
      return emptyReviewWhere
    }

    if (scopedMediaWorkIds.length === 1) {
      and.push({ mediaWork: { equals: scopedMediaWorkIds[0] } })
    } else {
      and.push({
        or: scopedMediaWorkIds.map((id) => ({ mediaWork: { equals: id } })),
      })
    }
  }

  if (filters.q) {
    const payload = await getPayloadClient()
    const titleMatchWorkWhere: Where[] = [
      { status: { equals: 'published' } },
      { title: { contains: filters.q } },
    ]

    if (filters.mediaType) {
      titleMatchWorkWhere.push({ mediaType: { equals: filters.mediaType } })
    }

    const matchingWorks = await payload.find({
      collection: 'media-works',
      where: { and: titleMatchWorkWhere },
      limit: 1000,
      depth: 0,
    })

    let matchingWorkIds = matchingWorks.docs.map((work) => work.id)

    if (scopedMediaWorkIds) {
      const scopedIds = new Set(scopedMediaWorkIds)
      matchingWorkIds = matchingWorkIds.filter((id) => scopedIds.has(id))
    }

    const or: Where[] = [{ title: { contains: filters.q } }]
    if (matchingWorkIds.length > 0) {
      if (matchingWorkIds.length === 1) {
        or.push({ mediaWork: { equals: matchingWorkIds[0] } })
      } else {
        or.push({
          or: matchingWorkIds.map((id) => ({ mediaWork: { equals: id } })),
        })
      }
    }

    and.push({ or })
  }

  return and.length === 1 ? and[0]! : { and }
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayloadClient()

  try {
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch {
    return null
  }
}

export async function getPublishedReviews(limit = 6, page = 1) {
  return searchReviews({ limit, page, sort: 'date' })
}

export async function searchReviews(filters: ReviewFilters = {}) {
  const payload = await getPayloadClient()
  const page = filters.page && filters.page > 0 ? filters.page : 1
  const limit = filters.limit ?? REVIEWS_PAGE_SIZE
  let where = await buildReviewWhere(filters)

  if (where === emptyReviewWhere) {
    return {
      docs: [] as Review[],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null as number | null,
      nextPage: null as number | null,
    }
  }

  if (filters.tag) {
    const tagId = await resolveTagId(filters.tag)
    if (!tagId) {
      return {
        docs: [] as Review[],
        totalDocs: 0,
        limit,
        totalPages: 0,
        page,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null as number | null,
        nextPage: null as number | null,
      }
    }

    where = {
      and: [where, { tags: { contains: tagId } }],
    }
  }

  return payload.find({
    collection: 'reviews',
    where,
    sort: sortForReviewFilters(filters.sort),
    depth: 2,
    limit,
    page,
  })
}

export async function getReviewsByMediaType(mediaType: MediaType, filters: ReviewFilters = {}) {
  const result = await searchReviews({
    ...filters,
    mediaType: undefined,
    limit: TYPE_LISTING_FETCH_LIMIT,
    page: 1,
  })

  const docs = result.docs.filter((review) => {
    const work = review.mediaWork
    return typeof work === 'object' && work !== null && work.mediaType === mediaType
  })

  return {
    ...result,
    docs,
    totalDocs: docs.length,
  }
}

export async function getUniqueWorksFromReviews(reviews: Review[]): Promise<
  Array<{
    work: MediaWork
    review: Review
  }>
> {
  const seen = new Set<number>()
  const items: Array<{ work: MediaWork; review: Review }> = []

  for (const review of reviews) {
    const work = review.mediaWork
    if (typeof work !== 'object' || work === null) continue
    if (work.status && work.status !== 'published') continue
    if (seen.has(work.id)) continue
    seen.add(work.id)
    items.push({ work, review })
  }

  return items
}

export async function getPopularTags(limit = 12): Promise<Tag[]> {
  const payload = await getPayloadClient()
  const reviews = await payload.find({
    collection: 'reviews',
    where: publishedReviewWhere,
    depth: 1,
    limit: TYPE_LISTING_FETCH_LIMIT,
    select: {
      tags: true,
    },
  })

  const counts = new Map<number, { tag: Tag; count: number }>()

  for (const review of reviews.docs) {
    for (const tag of review.tags ?? []) {
      if (typeof tag !== 'object' || tag === null) continue
      const existing = counts.get(tag.id)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(tag.id, { tag, count: 1 })
      }
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.tag.name.localeCompare(b.tag.name))
    .slice(0, limit)
    .map((entry) => entry.tag)
}

export async function getAllPublishedMediaWorks(): Promise<MediaWork[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'media-works',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
  })

  return result.docs
}

export async function getMediaWorkBySlug(
  mediaType: MediaType,
  slug: string,
): Promise<{ work: MediaWork; review: Review | null } | null> {
  const payload = await getPayloadClient()

  const works = await payload.find({
    collection: 'media-works',
    where: {
      and: [
        { slug: { equals: slug } },
        { mediaType: { equals: mediaType } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 1,
    limit: 1,
  })

  const work = works.docs[0]
  if (!work) return null

  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      and: [publishedReviewWhere, { mediaWork: { equals: work.id } }],
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 1,
  })

  return {
    work,
    review: reviews.docs[0] ?? null,
  }
}

const publishedListWhere = {
  status: {
    equals: 'published' as const,
  },
}

export async function getPublishedEditorialLists(limit = 50) {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'editorial-lists',
    where: publishedListWhere,
    sort: '-publishedAt',
    depth: 1,
    limit,
  })
}

export async function getFeaturedEditorialLists(limit = 3) {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'editorial-lists',
    where: {
      and: [publishedListWhere, { featured: { equals: true } }],
    },
    sort: '-publishedAt',
    depth: 1,
    limit,
  })
}

export async function getEditorialListBySlug(slug: string): Promise<EditorialList | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'editorial-lists',
    where: {
      and: [publishedListWhere, { slug: { equals: slug } }],
    },
    depth: 2,
    limit: 1,
  })

  return result.docs[0] ?? null
}

export async function getAllPublishedEditorialListSlugs(): Promise<Array<{ slug: string }>> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'editorial-lists',
    where: publishedListWhere,
    depth: 0,
    limit: 1000,
    select: {
      slug: true,
    },
  })

  return result.docs
    .filter((list) => typeof list.slug === 'string')
    .map((list) => ({ slug: list.slug as string }))
}

export function resolveReviewsFromEditorialList(list: EditorialList): Review[] {
  return (list.reviews ?? []).filter(
    (review): review is Review =>
      typeof review === 'object' && review !== null && review.status === 'published',
  )
}

export async function getReviewsForRssFeed(limit = 30) {
  return searchReviews({ limit, page: 1, sort: 'date' })
}

export async function getAllPublishedReviewsForStats() {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'reviews',
    where: publishedReviewWhere,
    depth: 2,
    limit: 1000,
    sort: '-publishedAt',
  })

  return result.docs
}

export async function getReviewStatistics(year?: number | null) {
  const reviews = await getAllPublishedReviewsForStats()
  const allStats = computeReviewStatistics(reviews)
  const filtered = filterReviewsByPublishedYear(reviews, year ?? null)
  const stats = computeReviewStatistics(filtered)

  return {
    ...stats,
    availablePublishedYears: allStats.availablePublishedYears,
  }
}
