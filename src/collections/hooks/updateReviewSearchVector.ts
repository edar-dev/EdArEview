import type { CollectionAfterChangeHook } from 'payload'
import { sql } from '@payloadcms/db-postgres'

import { buildReviewSearchText } from '@/lib/review-search'
import type { Review } from '@/payload-types'

export const updateReviewSearchVector: CollectionAfterChangeHook<Review> = async ({
  doc,
  req: { payload },
}) => {
  const searchText = buildReviewSearchText(doc)

  await payload.db.execute({
    sql: sql`UPDATE reviews SET search_vector = to_tsvector('italian', ${searchText}) WHERE id = ${doc.id}`,
  })

  return doc
}
