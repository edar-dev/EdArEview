import type { MediaType } from '@/lib/media-types'
import type { MediaWork, Review, SiteSetting } from '@/payload-types'

import { getPayloadClient } from './client'

const publishedReviewWhere = {
  status: {
    equals: 'published' as const,
  },
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
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'reviews',
    where: publishedReviewWhere,
    sort: '-publishedAt',
    depth: 2,
    limit,
    page,
  })
}

export async function getReviewsByMediaType(mediaType: MediaType, limit = 50) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'reviews',
    where: publishedReviewWhere,
    sort: '-publishedAt',
    depth: 2,
    limit: 100,
  })

  const reviews = result.docs.filter((review) => {
    const work = review.mediaWork
    return typeof work === 'object' && work !== null && work.mediaType === mediaType
  })

  return {
    ...result,
    docs: reviews.slice(0, limit),
    totalDocs: reviews.length,
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
    if (typeof work !== 'object' || work === null || work.status !== 'published') continue
    if (seen.has(work.id)) continue
    seen.add(work.id)
    items.push({ work, review })
  }

  return items
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
