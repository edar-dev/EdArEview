import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Impostazioni',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'EdArEview',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'homepageIntro',
      type: 'richText',
      label: 'Homepage intro',
    },
    {
      name: 'aboutPage',
      type: 'richText',
      label: 'About page',
      admin: {
        description: 'Contenuto lungo per la pagina /about (opzionale; altrimenti usa bio).',
      },
    },
  ],
}
