import type { CollectionBeforeChangeHook } from 'payload'

/** Sets `publishedAt` when transitioning to published (Reviews, MediaWorks). */
export const populatePublishedAtOnPublish: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
}) => {
  if (data?.status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
    return {
      ...data,
      publishedAt: new Date().toISOString(),
    }
  }

  return data
}
