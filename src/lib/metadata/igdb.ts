import type { MetadataSearchResult } from './types'
import { pickTitle } from './utils'

const IGDB_BASE = 'https://api.igdb.com/v4'
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'

type IgdbGame = {
  id: number
  name?: string
  summary?: string
  first_release_date?: number
  cover?: {
    image_id?: string
    url?: string
  }
  genres?: Array<{ name?: string }>
}

let cachedToken: { value: string; expiresAt: number } | null = null

function getTwitchCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.TWITCH_CLIENT_ID?.trim()
  const clientSecret = process.env.TWITCH_CLIENT_SECRET?.trim()

  if (!clientId || !clientSecret) {
    throw new Error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET are required for IGDB')
  }

  return { clientId, clientSecret }
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value
  }

  const { clientId, clientSecret } = getTwitchCredentials()
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  })

  const response = await fetch(`${TWITCH_TOKEN_URL}?${body.toString()}`, {
    method: 'POST',
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    throw new Error(`Twitch OAuth failed (${response.status})`)
  }

  const payload = (await response.json()) as {
    access_token?: string
    expires_in?: number
  }

  if (!payload.access_token) {
    throw new Error('Twitch OAuth response missing access_token')
  }

  const expiresInMs = (payload.expires_in ?? 3600) * 1000
  cachedToken = {
    value: payload.access_token,
    expiresAt: now + expiresInMs,
  }

  return cachedToken.value
}

function buildCoverUrl(game: IgdbGame): string | undefined {
  if (game.cover?.image_id) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
  }

  if (game.cover?.url) {
    return game.cover.url.startsWith('//') ? `https:${game.cover.url}` : game.cover.url
  }

  return undefined
}

function mapIgdbResult(item: IgdbGame): MetadataSearchResult {
  const year = item.first_release_date
    ? new Date(item.first_release_date * 1000).getUTCFullYear()
    : undefined

  return {
    externalSource: 'igdb',
    externalId: String(item.id),
    title: pickTitle(item.name),
    year,
    genres: (item.genres ?? [])
      .map((genre) => genre.name?.trim())
      .filter((name): name is string => Boolean(name)),
    coverUrl: buildCoverUrl(item),
    summary: item.summary?.trim() || undefined,
    raw: item as unknown as Record<string, unknown>,
  }
}

export async function searchIgdb(query: string): Promise<MetadataSearchResult[]> {
  const { clientId } = getTwitchCredentials()
  const token = await getAccessToken()

  const response = await fetch(`${IGDB_BASE}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: `search "${query.replace(/"/g, '\\"')}"; fields name,summary,first_release_date,cover.image_id,cover.url,genres.name; limit 10;`,
    next: { revalidate: 0 },
  })

  if (response.status === 401) {
    cachedToken = null
    throw new Error('IGDB token expired')
  }

  if (!response.ok) {
    throw new Error(`IGDB request failed (${response.status})`)
  }

  const games = (await response.json()) as IgdbGame[]
  return games.map(mapIgdbResult)
}
