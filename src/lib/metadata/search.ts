import { searchAnilist } from './anilist'
import { searchIgdb } from './igdb'
import { searchLetterboxd } from './letterboxd'
import { searchMal } from './mal'
import { searchSteam } from './steam'
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
    case 'manga': {
      const [anilist, mal] = await Promise.all([
        searchAnilist(trimmed, type).catch(() => [] as MetadataSearchResult[]),
        searchMal(trimmed, type).catch(() => [] as MetadataSearchResult[]),
      ])

      const seen = new Set<string>()
      return [...anilist, ...mal].filter((item) => {
        const key = `${item.externalSource}:${item.externalId}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
    case 'tv':
      return searchTmdb(trimmed, type)
    case 'movie': {
      const [tmdb, letterboxd] = await Promise.all([
        searchTmdb(trimmed, type).catch(() => [] as MetadataSearchResult[]),
        searchLetterboxd(trimmed).catch(() => [] as MetadataSearchResult[]),
      ])

      const seen = new Set<string>()
      return [...tmdb, ...letterboxd].filter((item) => {
        const key = `${item.externalSource}:${item.externalId}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
    case 'game': {
      const [steam, igdb] = await Promise.all([
        searchSteam(trimmed).catch(() => [] as MetadataSearchResult[]),
        searchIgdb(trimmed).catch(() => [] as MetadataSearchResult[]),
      ])

      const seen = new Set<string>()
      return [...steam, ...igdb].filter((item) => {
        const key = `${item.externalSource}:${item.externalId}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
    default:
      return []
  }
}
