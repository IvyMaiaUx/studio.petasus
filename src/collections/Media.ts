import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'
import { invalidateStudio } from '../lib/studio-invalidation'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        invalidateStudio()
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        invalidateStudio()
        return doc
      },
    ],
  },
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
      return headers
    },
  },
}
