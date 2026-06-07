export type MediaType = 'anime' | 'manga' | 'tv' | 'movie' | 'game'

export type ExternalSource = 'anilist' | 'tmdb' | 'igdb' | 'mal' | 'steam' | 'letterboxd'

export interface MetadataSearchResult {
  externalSource: ExternalSource
  externalId: string
  title: string
  titleOriginal?: string
  year?: number
  genres: string[]
  coverUrl?: string
  summary?: string
  raw: Record<string, unknown>
}

export const METADATA_MEDIA_TYPES: MediaType[] = ['anime', 'manga', 'tv', 'movie', 'game']

export function isMediaType(value: string | null): value is MediaType {
  return METADATA_MEDIA_TYPES.includes(value as MediaType)
}
