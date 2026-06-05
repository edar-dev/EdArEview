import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

type ReviewDoc = {
  status?: string | null
  mediaWork?:
    | number
    | string
    | {
        id?: number | string
        slug?: string | null
        mediaType?: string | null
      }
    | null
}

type MediaWorkDoc = {
  slug?: string | null
  mediaType?: string | null
  status?: string | null
}

const revalidateReviewPaths = async (
  review: ReviewDoc,
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
) => {
  if (review.status !== 'published') {
    return
  }

  revalidatePath('/')
  revalidatePath('/reviews')

  const mediaWorkRef = review.mediaWork
  const mediaWorkId =
    typeof mediaWorkRef === 'object' && mediaWorkRef !== null
      ? mediaWorkRef.id
      : mediaWorkRef

  if (!mediaWorkId) {
    return
  }

  let work: MediaWorkDoc | null =
    typeof mediaWorkRef === 'object' && mediaWorkRef !== null && 'slug' in mediaWorkRef
      ? mediaWorkRef
      : null

  if (!work?.slug || !work?.mediaType) {
    const fetched = await payload.findByID({
      collection: 'media-works',
      id: mediaWorkId,
      depth: 0,
    })
    work = fetched as MediaWorkDoc
  }

  if (work?.slug && work?.mediaType) {
    revalidatePath(`/${work.mediaType}/${work.slug}`)
  }
}

export const revalidateReview: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  await revalidateReviewPaths(doc as ReviewDoc, payload)

  if (previousDoc?.status === 'published' && doc.status !== 'published') {
    await revalidateReviewPaths(previousDoc as ReviewDoc, payload)
  }

  return doc
}

export const revalidateReviewDelete: CollectionAfterDeleteHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate || !doc) {
    return doc
  }

  await revalidateReviewPaths(doc as ReviewDoc, payload)
  return doc
}
