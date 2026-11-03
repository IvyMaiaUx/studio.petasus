import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { studioCategories, studioColors, highlightIcons } from '@/lib/studio-options'
import { invalidateStudio } from '@/lib/studio-invalidation'

const editor: Access = ({ req }) => req.user?.collection === 'admins'
const editorField: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const SocialHighlights: CollectionConfig = {
  slug: 'social-highlights',
  labels: { singular: 'Destaque', plural: 'Destaques da Petasus' },
  admin: {
    useAsTitle: 'name',
    group: 'Petasus',
    defaultColumns: ['name', 'category', '_status', 'sortOrder', 'updatedAt'],
  },
  access: {
    create: editor,
    update: editor,
    delete: editor,
    read: ({ req }) =>
      req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } },
  },
  versions: { drafts: true, maxPerDoc: 20 },
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
  fields: [
    { name: 'name', label: 'Nome no perfil', type: 'text', required: true, maxLength: 15 },
    {
      name: 'icon',
      label: 'Ícone da capa',
      type: 'select',
      required: true,
      options: [...highlightIcons],
      defaultValue: 'spark',
    },
    {
      name: 'color',
      label: 'Cor da capa',
      type: 'select',
      required: true,
      options: [...studioColors],
      defaultValue: 'yellow',
    },
    {
      name: 'category',
      label: 'Tema relacionado',
      type: 'select',
      required: true,
      options: [...studioCategories],
    },
    {
      name: 'stories',
      label: 'Stories na ordem de publicação',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 20,
      fields: [
        { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 100 },
        { name: 'accent', label: 'Destaque em itálico', type: 'text', maxLength: 80 },
        { name: 'body', label: 'Texto', type: 'textarea', maxLength: 450 },
        {
          name: 'color',
          label: 'Cor',
          type: 'select',
          required: true,
          options: [...studioColors],
          defaultValue: 'yellow',
        },
      ],
    },
    {
      name: 'sortOrder',
      label: 'Ordem no perfil',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourceKey',
      type: 'text',
      unique: true,
      index: true,
      access: { create: editorField, update: editorField },
      admin: { hidden: true },
    },
  ],
}
