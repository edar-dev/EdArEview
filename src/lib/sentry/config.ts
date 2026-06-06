import type { BrowserOptions, EdgeOptions, NodeOptions } from '@sentry/nextjs'

export function getSentryDsn(): string | undefined {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
}

export function isSentryEnabled(): boolean {
  return Boolean(getSentryDsn())
}

export function getSentryEnvironment(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'
}

export function getBaseSentryOptions(): Pick<
  NodeOptions & BrowserOptions & EdgeOptions,
  'dsn' | 'enabled' | 'environment' | 'tracesSampleRate'
> {
  const dsn = getSentryDsn()

  return {
    dsn,
    enabled: Boolean(dsn),
    environment: getSentryEnvironment(),
    tracesSampleRate: getSentryEnvironment() === 'development' ? 1.0 : 0.1,
  }
}
