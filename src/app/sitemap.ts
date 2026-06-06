import type { MetadataRoute } from 'next'

import { mediaTypeToRoute } from '@/lib/media-types'
import { getAllPublishedMediaWorks, getAllPublishedEditorialListSlugs } from '@/lib/payload/queries'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerSideURL()
  const [works, listSlugs] = await Promise.all([
    getAllPublishedMediaWorks(),
    getAllPublishedEditorialListSlugs(),
  ])

  const typeRoutes = ['anime', 'manga', 'tv', 'movie', 'games'] as const

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/reviews`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lists`,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/stats`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...typeRoutes.map((route) => ({
      url: `${baseUrl}/${route}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...works.map((work) => ({
      url: `${baseUrl}/${mediaTypeToRoute(work.mediaType)}/${work.slug}`,
      lastModified: work.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...listSlugs.map(({ slug }) => ({
      url: `${baseUrl}/lists/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
  ]
}
