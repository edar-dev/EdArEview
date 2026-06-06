import type { MediaWork } from '@/payload-types'

export type MediaType = MediaWork['mediaType']

export type MediaTypeRoute = MediaType | 'games'

export const MEDIA_TYPES: MediaType[] = ['anime', 'manga', 'tv', 'movie', 'game']

export const MEDIA_TYPE_ROUTES: MediaTypeRoute[] = [...MEDIA_TYPES.filter((t) => t !== 'game'), 'games']

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  anime: 'Anime',
  manga: 'Manga',
  tv: 'TV Series',
  movie: 'Movies',
  game: 'Games',
}

export const MEDIA_TYPE_NAV: Array<{ route: MediaTypeRoute; label: string }> = [
  { route: 'anime', label: 'Anime' },
  { route: 'manga', label: 'Manga' },
  { route: 'tv', label: 'TV' },
  { route: 'movie', label: 'Film' },
  { route: 'games', label: 'Giochi' },
]

export function routeToMediaType(route: string): MediaType | null {
  if (route === 'games') return 'game'
  if (MEDIA_TYPES.includes(route as MediaType)) return route as MediaType
  return null
}

export function mediaTypeToRoute(mediaType: MediaType): MediaTypeRoute {
  return mediaType === 'game' ? 'games' : mediaType
}

export function isMediaTypeRoute(route: string): route is MediaTypeRoute {
  return MEDIA_TYPE_ROUTES.includes(route as MediaTypeRoute)
}

export function getWorkPath(work: Pick<MediaWork, 'slug' | 'mediaType'>): string {
  return `/${mediaTypeToRoute(work.mediaType)}/${work.slug}`
}
