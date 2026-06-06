import { NextRequest } from 'next/server'

import { verifyMetadataAccess } from '@/lib/metadata/auth'
import { searchMetadata } from '@/lib/metadata/search'
import { isMediaType } from '@/lib/metadata/types'

export async function GET(req: NextRequest): Promise<Response> {
  const unauthorized = await verifyMetadataAccess(req)
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(req.url)
  const typeParam = searchParams.get('type')
  const query = searchParams.get('q')?.trim() ?? ''

  if (!isMediaType(typeParam)) {
    return Response.json({ error: 'Invalid media type' }, { status: 400 })
  }

  if (query.length < 2) {
    return Response.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  try {
    const results = await searchMetadata(typeParam, query)
    return Response.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Metadata search failed'

    if (message.includes('not configured') || message.includes('required for IGDB')) {
      return Response.json({ error: message }, { status: 503 })
    }

    console.error('[metadata/search]', message)
    return Response.json({ error: 'Catalog temporarily unavailable' }, { status: 502 })
  }
}
