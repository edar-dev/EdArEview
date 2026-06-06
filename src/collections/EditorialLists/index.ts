import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublishedStatus } from '../../access/authenticatedOrPublishedStatus'
import { populatePublishedAtOnPublish } from '../hooks/populatePublishedAtOnPublish'
import {
  revalidateEditorialList,
  revalidateEditorialListDelete,
} from '../hooks/revalidateEditorialList'

export const EditorialLists: CollectionConfig = {
  slug: 'editorial-lists',
  labels: {
    singular: 'Lista editoriale',
    plural: 'Liste editoriali',
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
    defaultColumns: ['title', 'featured', 'status', 'publishedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    description: true,
    featured: true,
    status: true,
    publishedAt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'title' }),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Breve intro mostrata in archivio e pagina lista.',
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
      admin: {
        description: 'Recensioni incluse nella lista, trascinabili per ordinare.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'In evidenza in homepage',
      admin: {
        position: 'sidebar',
      },
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
    afterChange: [revalidateEditorialList],
    afterDelete: [revalidateEditorialListDelete],
  },
  timestamps: true,
}
