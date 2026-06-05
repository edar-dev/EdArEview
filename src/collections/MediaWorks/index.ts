import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublishedStatus } from '../../access/authenticatedOrPublishedStatus'
import { populatePublishedAtOnPublish } from '../hooks/populatePublishedAtOnPublish'
import {
  revalidateMediaWork,
  revalidateMediaWorkDelete,
} from '../hooks/revalidateMediaWork'
import { validateMediaWorkExternalId } from '../hooks/validateMediaWorkExternalId'

export const MediaWorks: CollectionConfig = {
  slug: 'media-works',
  labels: {
    singular: 'Media Work',
    plural: 'Media Works',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
  },
  admin: {
    group: 'Catalogo',
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType', 'year', 'status', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    mediaType: true,
    coverUrl: true,
    year: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'titleOriginal',
      type: 'text',
      label: 'Original title',
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        { label: 'Anime', value: 'anime' },
        { label: 'Manga', value: 'manga' },
        { label: 'TV Series', value: 'tv' },
        { label: 'Movie', value: 'movie' },
        { label: 'Game', value: 'game' },
      ],
      index: true,
    },
    {
      name: 'externalSource',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'AniList', value: 'anilist' },
        { label: 'TMDB', value: 'tmdb' },
        { label: 'IGDB', value: 'igdb' },
      ],
    },
    {
      name: 'externalId',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.externalSource !== 'manual',
        description: 'Required for API-imported works (AniList, TMDB, IGDB).',
      },
    },
    {
      name: 'year',
      type: 'number',
      min: 1900,
      max: 2100,
    },
    {
      name: 'genres',
      type: 'array',
      fields: [
        {
          name: 'genre',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'coverUrl',
      type: 'text',
      label: 'Cover URL',
      admin: {
        description: 'External cover image URL (from API or manual).',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Uploaded cover',
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Raw metadata cache from external APIs (Fase 3).',
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
    slugField({ fieldToUse: 'title' }),
  ],
  hooks: {
    beforeValidate: [validateMediaWorkExternalId],
    beforeChange: [populatePublishedAtOnPublish],
    afterChange: [revalidateMediaWork],
    afterDelete: [revalidateMediaWorkDelete],
  },
  timestamps: true,
}
