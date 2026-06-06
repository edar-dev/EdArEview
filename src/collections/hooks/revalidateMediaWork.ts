import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import { mediaTypeToRoute } from '@/lib/media-types'

type MediaWorkDoc = {
  slug?: string | null
  mediaType?: string | null
  status?: string | null
}

const revalidateMediaWorkPaths = (work: MediaWorkDoc) => {
  if (work.status !== 'published' || !work.slug || !work.mediaType) {
    return
  }

  const route = mediaTypeToRoute(work.mediaType as 'anime' | 'manga' | 'tv' | 'movie' | 'game')

  revalidatePath('/')
  revalidatePath(`/${route}`)
  revalidatePath(`/${route}/${work.slug}`)
}

export const revalidateMediaWork: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  revalidateMediaWorkPaths(doc as MediaWorkDoc)

  if (previousDoc?.status === 'published' && doc.status !== 'published') {
    revalidateMediaWorkPaths(previousDoc as MediaWorkDoc)
  }

  return doc
}

export const revalidateMediaWorkDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (context.disableRevalidate || !doc) {
    return doc
  }

  revalidateMediaWorkPaths(doc as MediaWorkDoc)
  return doc
}
