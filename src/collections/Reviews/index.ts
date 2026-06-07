import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublishedStatus } from '../../access/authenticatedOrPublishedStatus'
import { populatePublishedAtOnPublish } from '../hooks/populatePublishedAtOnPublish'
import { revalidateReview, revalidateReviewDelete } from '../hooks/revalidateReview'
import { updateReviewSearchVector } from '../hooks/updateReviewSearchVector'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
  },
  admin: {
    group: 'Contenuti',
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaWork', 'rating', 'status', 'publishedAt'],
  },
  defaultPopulate: {
    title: true,
    rating: true,
    mediaWork: true,
    status: true,
    publishedAt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaWork',
      type: 'relationship',
      relationTo: 'media-works',
      required: true,
      index: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 10,
      admin: {
        step: 0.5,
        description: 'Score from 0 to 10.',
      },
    },
    {
      name: 'watchStatus',
      type: 'select',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Watching / Reading', value: 'watching' },
        { label: 'Completed', value: 'completed' },
        { label: 'Dropped', value: 'dropped' },
        { label: 'On hold', value: 'on_hold' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hasSpoilers',
      type: 'checkbox',
      defaultValue: false,
      label: 'Contains spoilers',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAtOnPublish],
    afterChange: [updateReviewSearchVector, revalidateReview],
    afterDelete: [revalidateReviewDelete],
  },
  timestamps: true,
}
