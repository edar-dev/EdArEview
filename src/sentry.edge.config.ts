import * as Sentry from '@sentry/nextjs'

import { getBaseSentryOptions } from '@/lib/sentry/config'

Sentry.init({
  ...getBaseSentryOptions(),
})
