import type { MetadataSearchResult } from './types'
import { pickTitle } from './utils'

const JIKAN_BASE = 'https://api.jikan.moe/v4'

type JikanItem = {
  mal_id: number
  title?: string
  title_english?: string | null
  title_japanese?: string | null
  year?: number | null
  genres?: Array<{ name?: string }>
  images?: {
    jpg?: {
      large_image_url?: string | null
    }
  }
  synopsis?: string | null
}

function mapJikanResult(item: JikanItem, type: 'anime' | 'manga'): MetadataSearchResult {
  const title = pickTitle(item.title_english, item.title, item.title_japanese)
  const titleOriginal = item.title_japanese?.trim() || undefined

  return {
    externalSource: 'mal',
    externalId: String(item.mal_id),
    title,
    titleOriginal: titleOriginal !== title ? titleOriginal : undefined,
    year: item.year ?? undefined,
    genres: item.genres?.map((genre) => genre.name).filter(Boolean) as string[] ?? [],
    coverUrl: item.images?.jpg?.large_image_url ?? undefined,
    summary: item.synopsis?.trim() || undefined,
    raw: { ...item, mediaType: type },
  }
}

export async function searchMal(query: string, type: 'anime' | 'manga'): Promise<MetadataSearchResult[]> {
  const endpoint = type === 'anime' ? 'anime' : 'manga'
  const url = `${JIKAN_BASE}/${endpoint}?q=${encodeURIComponent(query)}&limit=10`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`MAL/Jikan search failed (${response.status})`)
  }

  const payload = (await response.json()) as { data?: JikanItem[] }
  return (payload.data ?? []).map((item) => mapJikanResult(item, type))
}
