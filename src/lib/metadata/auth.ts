import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

export async function verifyMetadataAccess(req: Request): Promise<Response | null> {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.PAYLOAD_SECRET &&
    req.headers.get('x-metadata-dev-secret') === process.env.PAYLOAD_SECRET
  ) {
    return null
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })

    const user = result?.user ?? result

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
