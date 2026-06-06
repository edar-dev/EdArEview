import { mediaTypeToRoute, type MediaType } from '@/lib/media-types'
import { getServerSideURL } from '@/utilities/getURL'

type OgImageParams = {
  title: string
  rating?: number | null
  mediaType?: MediaType
  cover?: string | null
}

export function buildOgImageUrl({ title, rating, mediaType, cover }: OgImageParams): string {
  const params = new URLSearchParams()
  params.set('title', title)

  if (rating != null) params.set('rating', String(rating))
  if (mediaType) params.set('type', mediaTypeToRoute(mediaType))
  if (cover?.trim()) params.set('cover', cover.trim())

  return `${getServerSideURL()}/api/og?${params.toString()}`
}
