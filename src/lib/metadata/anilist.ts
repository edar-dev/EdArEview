import type { MetadataSearchResult } from './types'
import { pickTitle, stripHtml } from './utils'

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'

type AniListMediaType = 'ANIME' | 'MANGA'

interface AniListMedia {
  id: number
  title?: {
    romaji?: string | null
    english?: string | null
    native?: string | null
  }
  startDate?: {
    year?: number | null
  }
  genres?: string[] | null
  coverImage?: {
    large?: string | null
  }
  description?: string | null
}

const SEARCH_QUERY = `
  query ($search: String, $type: MediaType) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: $type) {
        id
        title { romaji english native }
        startDate { year }
        genres
        coverImage { large }
        description
      }
    }
  }
`

function mapAniListResult(item: AniListMedia): MetadataSearchResult {
  const title = pickTitle(item.title?.english, item.title?.romaji, item.title?.native)
  const titleOriginal = item.title?.native?.trim() || item.title?.romaji?.trim() || undefined

  return {
    externalSource: 'anilist',
    externalId: String(item.id),
    title,
    titleOriginal: titleOriginal !== title ? titleOriginal : undefined,
    year: item.startDate?.year ?? undefined,
    genres: item.genres?.filter(Boolean) ?? [],
    coverUrl: item.coverImage?.large ?? undefined,
    summary: item.description ? stripHtml(item.description) : undefined,
    raw: item as unknown as Record<string, unknown>,
  }
}

export async function searchAnilist(
  query: string,
  type: 'anime' | 'manga',
): Promise<MetadataSearchResult[]> {
  const anilistType: AniListMediaType = type === 'anime' ? 'ANIME' : 'MANGA'

  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        search: query,
        type: anilistType,
      },
    }),
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    throw new Error(`AniList request failed (${response.status})`)
  }

  const payload = (await response.json()) as {
    data?: { Page?: { media?: AniListMedia[] } }
    errors?: Array<{ message?: string }>
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'AniList returned an error')
  }

  const media = payload.data?.Page?.media ?? []
  return media.map(mapAniListResult)
}
