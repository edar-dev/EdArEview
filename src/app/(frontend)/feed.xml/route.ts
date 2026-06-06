import { buildReviewsRssFeed } from '@/lib/rss'
import { getReviewsForRssFeed, getSiteSettings } from '@/lib/payload/queries'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 3600

export async function GET() {
  const [settings, reviewsResult] = await Promise.all([
    getSiteSettings(),
    getReviewsForRssFeed(30),
  ])

  const siteUrl = getServerSideURL()
  const siteName = settings?.siteName ?? 'EdArEview'
  const siteDescription =
    settings?.tagline ??
    'Catalogo personale e recensioni per anime, manga, serie TV, film e videogiochi.'

  const feed = buildReviewsRssFeed({
    siteName,
    siteUrl,
    siteDescription,
    reviews: reviewsResult.docs,
  })

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
