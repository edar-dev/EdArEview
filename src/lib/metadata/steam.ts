import type { MetadataSearchResult } from './types'

type SteamSearchItem = {
  id: number
  name?: string
  tiny_image?: string
}

type SteamSearchResponse = {
  items?: SteamSearchItem[]
}

export async function searchSteam(query: string): Promise<MetadataSearchResult[]> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Steam search failed (${response.status})`)
  }

  const payload = (await response.json()) as SteamSearchResponse

  return (payload.items ?? [])
    .filter((item) => item.id && item.name)
    .slice(0, 10)
    .map((item) => ({
      externalSource: 'steam' as const,
      externalId: String(item.id),
      title: item.name!.trim(),
      genres: [],
      coverUrl: item.tiny_image?.replace('/capsule_sm_120', '/header') ?? item.tiny_image,
      raw: item as unknown as Record<string, unknown>,
    }))
}
