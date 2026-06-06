import type { MetadataSearchResult } from './types'
import { pickTitle } from './utils'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

type TmdbSearchItem = {
  id: number
  name?: string
  title?: string
  original_name?: string
  original_title?: string
  overview?: string
  poster_path?: string | null
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
}

type TmdbGenre = {
  id: number
  name: string
}

let tvGenreMap: Map<number, string> | null = null
let movieGenreMap: Map<number, string> | null = null

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not configured')
  }
  return apiKey
}

function parseYear(date?: string): number | undefined {
  if (!date) return undefined
  const year = Number.parseInt(date.slice(0, 4), 10)
  return Number.isFinite(year) ? year : undefined
}

async function loadGenreMap(type: 'tv' | 'movie'): Promise<Map<number, string>> {
  const cached = type === 'tv' ? tvGenreMap : movieGenreMap
  if (cached) return cached

  const apiKey = getApiKey()
  const response = await fetch(`${TMDB_BASE}/genre/${type}/list?api_key=${apiKey}&language=en-US`, {
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    throw new Error(`TMDB genre list failed (${response.status})`)
  }

  const payload = (await response.json()) as { genres?: TmdbGenre[] }
  const map = new Map<number, string>(
    (payload.genres ?? []).map((genre) => [genre.id, genre.name]),
  )

  if (type === 'tv') {
    tvGenreMap = map
  } else {
    movieGenreMap = map
  }

  return map
}

function mapTmdbResult(
  item: TmdbSearchItem,
  type: 'tv' | 'movie',
  genreMap: Map<number, string>,
): MetadataSearchResult {
  const title = pickTitle(item.name, item.title)
  const titleOriginal = pickTitle(item.original_name, item.original_title)
  const date = type === 'tv' ? item.first_air_date : item.release_date

  return {
    externalSource: 'tmdb',
    externalId: String(item.id),
    title,
    titleOriginal: titleOriginal !== title ? titleOriginal : undefined,
    year: parseYear(date),
    genres: (item.genre_ids ?? [])
      .map((id) => genreMap.get(id))
      .filter((name): name is string => Boolean(name)),
    coverUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : undefined,
    summary: item.overview?.trim() || undefined,
    raw: item as unknown as Record<string, unknown>,
  }
}

export async function searchTmdb(
  query: string,
  type: 'tv' | 'movie',
): Promise<MetadataSearchResult[]> {
  const apiKey = getApiKey()
  const genreMap = await loadGenreMap(type)
  const endpoint = type === 'tv' ? 'search/tv' : 'search/movie'

  const url = new URL(`${TMDB_BASE}/${endpoint}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('query', query)
  url.searchParams.set('include_adult', 'false')
  url.searchParams.set('language', 'en-US')

  const response = await fetch(url, { next: { revalidate: 0 } })

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`)
  }

  const payload = (await response.json()) as { results?: TmdbSearchItem[] }
  return (payload.results ?? []).slice(0, 10).map((item) => mapTmdbResult(item, type, genreMap))
}
