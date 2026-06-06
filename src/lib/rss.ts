import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { getWorkPath } from '@/lib/media-types'
import type { MediaWork, Review } from '@/payload-types'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function resolveMediaWork(review: Review): MediaWork | null {
  const work = review.mediaWork
  return typeof work === 'object' && work !== null ? work : null
}

function reviewDescription(review: Review, siteUrl: string): string {
  const work = resolveMediaWork(review)
  const path = work ? getWorkPath(work) : '/reviews'
  const url = `${siteUrl}${path}`

  const excerpt = review.body
    ? convertLexicalToPlaintext({ data: review.body }).slice(0, 280)
    : review.title

  const rating =
    typeof review.rating === 'number' ? ` · Voto ${review.rating}/10` : ''

  return `${escapeXml(excerpt)}${rating} — <a href="${url}">Leggi su EdArEview</a>`
}

export function buildReviewsRssFeed({
  siteName,
  siteUrl,
  siteDescription,
  reviews,
}: {
  siteName: string
  siteUrl: string
  siteDescription: string
  reviews: Review[]
}): string {
  const items = reviews
    .map((review) => {
      const work = resolveMediaWork(review)
      if (!work) return null

      const link = `${siteUrl}${getWorkPath(work)}`
      const pubDate = review.publishedAt
        ? new Date(review.publishedAt).toUTCString()
        : new Date(review.updatedAt).toUTCString()

      return `<item>
  <title>${escapeXml(review.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${reviewDescription(review, siteUrl)}</description>
</item>`
    })
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} — Recensioni</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>it</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}
