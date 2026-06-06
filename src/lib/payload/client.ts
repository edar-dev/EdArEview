import { getPayload } from 'payload'
import { cache } from 'react'

import configPromise from '@payload-config'

export const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})
