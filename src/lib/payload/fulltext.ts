import { sql } from '@payloadcms/db-postgres'

import { getPayloadClient } from './client'

export async function searchReviewIdsByFullText(query: string): Promise<number[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const payload = await getPayloadClient()
  const result = await payload.db.execute({
    sql: sql`SELECT id FROM reviews WHERE search_vector @@ plainto_tsquery('italian', ${trimmed}) LIMIT 200`,
  })

  const rows = result.rows as Array<{ id: number }>
  return rows.map((row) => row.id)
}
