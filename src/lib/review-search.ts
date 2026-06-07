import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import type { Review } from '@/payload-types'

export function buildReviewSearchText(review: Pick<Review, 'title' | 'body'>): string {
  const bodyText = review.body ? convertLexicalToPlaintext({ data: review.body }) : ''
  return [review.title, bodyText].filter(Boolean).join('\n').trim()
}
