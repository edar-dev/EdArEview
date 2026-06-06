import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

type EditorialListDoc = {
  slug?: string | null
  status?: string | null
}

const revalidateEditorialListPaths = (doc: EditorialListDoc) => {
  revalidatePath('/')
  revalidatePath('/lists')

  if (doc.slug) {
    revalidatePath(`/lists/${doc.slug}`)
  }

  revalidatePath('/feed.xml')
}

export const revalidateEditorialList: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc.status === 'published') {
    revalidateEditorialListPaths(doc as EditorialListDoc)
  }

  if (previousDoc?.status === 'published' && doc.status !== 'published') {
    revalidateEditorialListPaths(previousDoc as EditorialListDoc)
  }

  return doc
}

export const revalidateEditorialListDelete: CollectionAfterDeleteHook = async ({
  doc,
  req: { context },
}) => {
  if (context.disableRevalidate || !doc) {
    return doc
  }

  revalidateEditorialListPaths(doc as EditorialListDoc)
  return doc
}
