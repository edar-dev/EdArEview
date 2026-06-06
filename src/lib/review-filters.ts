import type { MediaType } from '@/lib/media-types'
import type { Review } from '@/payload-types'

export type ReviewSort = 'date' | 'rating' | 'title'

export type WatchStatus = NonNullable<Review['watchStatus']>

export type ReviewFilters = {
  q?: string
  minRating?: number
  year?: number
  status?: WatchStatus
  tag?: string
  sort?: ReviewSort
  page?: number
  mediaType?: MediaType
  limit?: number
}

export const REVIEWS_PAGE_SIZE = 12
export const TYPE_LISTING_FETCH_LIMIT = 500

export const WATCH_STATUS_OPTIONS: Array<{ value: WatchStatus; label: string }> = [
  { value: 'planned', label: 'In programma' },
  { value: 'watching', label: 'In corso' },
  { value: 'completed', label: 'Completato' },
  { value: 'dropped', label: 'Abbandonato' },
  { value: 'on_hold', label: 'In pausa' },
]

export const SORT_OPTIONS: Array<{ value: ReviewSort; label: string }> = [
  { value: 'date', label: 'Data' },
  { value: 'rating', label: 'Voto' },
  { value: 'title', label: 'Titolo' },
]

const WATCH_STATUSES = new Set<WatchStatus>([
  'planned',
  'watching',
  'completed',
  'dropped',
  'on_hold',
])

const SORT_VALUES = new Set<ReviewSort>(['date', 'rating', 'title'])

function parseNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw?.trim()) return undefined
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseString(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const trimmed = raw?.trim()
  return trimmed || undefined
}

export function parseReviewFilters(
  searchParams: Record<string, string | string[] | undefined>,
  defaults: Partial<ReviewFilters> = {},
): ReviewFilters {
  const q = parseString(searchParams.q)
  const minRating = parseNumber(searchParams.minRating)
  const year = parseNumber(searchParams.year)
  const page = parseNumber(searchParams.page)
  const statusRaw = parseString(searchParams.status)
  const sortRaw = parseString(searchParams.sort)
  const tag = parseString(searchParams.tag)

  const status =
    statusRaw && WATCH_STATUSES.has(statusRaw as WatchStatus)
      ? (statusRaw as WatchStatus)
      : undefined
  const sort =
    sortRaw && SORT_VALUES.has(sortRaw as ReviewSort) ? (sortRaw as ReviewSort) : undefined

  return {
    ...defaults,
    ...(q && { q }),
    ...(minRating !== undefined && minRating > 0 && { minRating }),
    ...(year !== undefined && year > 0 && { year }),
    ...(status && { status }),
    ...(tag && { tag }),
    sort: sort ?? defaults.sort ?? 'date',
    page: page && page > 0 ? Math.floor(page) : 1,
    limit: defaults.limit ?? REVIEWS_PAGE_SIZE,
  }
}

export function buildFilterSearchParams(filters: ReviewFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q) params.set('q', filters.q)
  if (filters.minRating && filters.minRating > 0) {
    params.set('minRating', String(filters.minRating))
  }
  if (filters.year && filters.year > 0) params.set('year', String(filters.year))
  if (filters.status) params.set('status', filters.status)
  if (filters.tag) params.set('tag', filters.tag)
  if (filters.sort && filters.sort !== 'date') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  return params
}

export function buildFilteredPath(basePath: string, filters: ReviewFilters): string {
  const params = buildFilterSearchParams(filters)
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}
