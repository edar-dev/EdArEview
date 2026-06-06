import canUseDOM from './canUseDOM'

const CANONICAL_PRODUCTION_URL = 'https://edareview.vercel.app'

const vercelURL = () => {
  if (process.env.VERCEL_ENV === 'production') {
    return CANONICAL_PRODUCTION_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return null
}

export const getServerSideURL = () => {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    vercelURL() ||
    'http://localhost:3000'
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getServerSideURL()
}
