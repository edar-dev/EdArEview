import type { CollectionBeforeValidateHook } from 'payload'

export const validateMediaWorkExternalId: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const source = data?.externalSource
  const externalId = data?.externalId?.trim()

  if (source && source !== 'manual' && !externalId) {
    throw new Error('External ID is required when the source is not manual.')
  }

  if (source === 'manual') {
    return data
  }

  if (!source || !externalId) {
    return data
  }

  const existing = await req.payload.find({
    collection: 'media-works',
    where: {
      and: [
        { externalSource: { equals: source } },
        { externalId: { equals: externalId } },
        ...(operation === 'update' && originalDoc?.id
          ? [{ id: { not_equals: originalDoc.id } }]
          : []),
      ],
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs.length > 0) {
    throw new Error(`A media work with source "${source}" and external ID "${externalId}" already exists.`)
  }

  return data
}
