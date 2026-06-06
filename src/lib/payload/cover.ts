import type { Media, MediaWork } from '@/payload-types'

export function getCoverUrl(work: Pick<MediaWork, 'coverUrl' | 'cover'>): string | null {
  if (work.coverUrl?.trim()) {
    return work.coverUrl.trim()
  }

  const cover = work.cover
  if (cover && typeof cover === 'object' && cover.url) {
    return cover.url
  }

  return null
}

export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}
