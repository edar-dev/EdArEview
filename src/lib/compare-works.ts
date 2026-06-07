import type { MediaType } from '@/lib/media-types'
import { mediaTypeToRoute } from '@/lib/media-types'
import type { MediaWork, Review } from '@/payload-types'

export type WorkRef = {
  type: MediaType
  slug: string
}

export type ParsedWorkRef = WorkRef | null

export function parseWorkRef(value: string | null | undefined): ParsedWorkRef {
  if (!value?.trim()) return null

  const parts = value.split('/').filter(Boolean)
  if (parts.length !== 2) return null

  const [route, slug] = parts
  const type =
    route === 'games'
      ? 'game'
      : route === 'anime' || route === 'manga' || route === 'tv' || route === 'movie'
        ? route
        : null

  if (!type || !slug) return null

  return { type, slug }
}

export function formatWorkRef(work: Pick<MediaWork, 'slug' | 'mediaType'>): string {
  return `${mediaTypeToRoute(work.mediaType)}/${work.slug}`
}

export function resolveReview(work: MediaWork, review: Review | null) {
  return review
}

export function sharedGenres(workA: MediaWork, workB: MediaWork): string[] {
  const genresB = new Set((workB.genres ?? []).map((entry) => entry.genre.toLowerCase()))
  return (workA.genres ?? [])
    .map((entry) => entry.genre)
    .filter((genre) => genresB.has(genre.toLowerCase()))
}

export function sharedTagNames(reviewA: Review | null, reviewB: Review | null): string[] {
  const tagsB = new Set<string>()

  for (const tag of reviewB?.tags ?? []) {
    if (typeof tag === 'object' && tag !== null) {
      tagsB.add(tag.name.toLowerCase())
    }
  }

  const shared: string[] = []

  for (const tag of reviewA?.tags ?? []) {
    if (typeof tag === 'object' && tag !== null && tagsB.has(tag.name.toLowerCase())) {
      shared.push(tag.name)
    }
  }

  return shared.sort((a, b) => a.localeCompare(b, 'it'))
}
