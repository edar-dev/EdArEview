import type { MetadataSearchResult } from './types'
import { pickTitle } from './utils'

type LetterboxdAutocompleteItem = {
  id?: string
  name?: string
  y?: number
  img?: string
}

export async function searchLetterboxd(query: string): Promise<MetadataSearchResult[]> {
  const url = `https://letterboxd.com/s/autocompletefilm?q=${encodeURIComponent(query)}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'EdArEview/1.0 (metadata import)',
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Letterboxd search failed (${response.status})`)
  }

  const payload = (await response.json()) as {
    items?: LetterboxdAutocompleteItem[]
  }

  return (payload.items ?? [])
    .filter((item) => item.id && item.name)
    .slice(0, 10)
    .map((item) => ({
      externalSource: 'letterboxd' as const,
      externalId: item.id!.replace(/^film\//, ''),
      title: pickTitle(item.name),
      year: item.y ?? undefined,
      genres: [],
      coverUrl: item.img ? `https://letterboxd.com${item.img}` : undefined,
      raw: item as unknown as Record<string, unknown>,
    }))
}
