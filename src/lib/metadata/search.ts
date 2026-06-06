import { searchAnilist } from './anilist'
import { searchIgdb } from './igdb'
import { searchTmdb } from './tmdb'
import type { MediaType, MetadataSearchResult } from './types'

export async function searchMetadata(
  type: MediaType,
  query: string,
): Promise<MetadataSearchResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return []
  }

  switch (type) {
    case 'anime':
    case 'manga':
      return searchAnilist(trimmed, type)
    case 'tv':
    case 'movie':
      return searchTmdb(trimmed, type)
    case 'game':
      return searchIgdb(trimmed)
    default:
      return []
  }
}
