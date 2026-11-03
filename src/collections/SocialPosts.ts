import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { studioCategories, studioColors, studioFormats } from '@/lib/studio-options'
import { invalidateStudio } from '@/lib/studio-invalidation'

const editor: Access = ({ req }) => req.user?.collection === 'admins'
const editorField: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const SocialPosts: CollectionConfig = {
  slug: 'social-posts',
  labels: { singular: 'Post', plural: 'Posts da Petasus' },
  admin: {
    useAsTitle: 'title',
    group: 'Petasus',
    defaultColumns: ['title', 'category', 'format', '_status', 'updatedAt'],
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
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (
          data.format === 'Carrossel' &&
          (!Array.isArray(data.slides) || data.slides.length < 2)
        ) {
          throw new Error('Um carrossel precisa ter pelo menos dois slides.')
        }
        if (
          data.format === 'Post estático' &&
          Array.isArray(data.slides) &&
          data.slides.length > 1
        ) {
          throw new Error('Um post estático deve ter apenas uma arte.')
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 100 },
    { name: 'accent', label: 'Trecho em destaque', type: 'text', maxLength: 100 },
    { name: 'subtitle', label: 'Texto de apoio', type: 'textarea', maxLength: 600 },
    { name: 'label', label: 'Chamada superior', type: 'text', maxLength: 60 },
    {
      name: 'category',
      label: 'Tema',
      type: 'select',
      required: true,
      options: [...studioCategories],
      admin: { position: 'sidebar' },
    },
    {
      name: 'color',
      label: 'Cor da capa',
      type: 'select',
      required: true,
      options: [...studioColors],
      defaultValue: 'brown',
      admin: { position: 'sidebar' },
    },
    {
      name: 'format',
      label: 'Formato',
      type: 'select',
      required: true,
      options: [...studioFormats],
      defaultValue: 'Post estático',
      admin: { position: 'sidebar' },
    },
    { name: 'caption', label: 'Legenda', type: 'textarea', maxLength: 2200 },
    {
      name: 'slides',
      label: 'Artes na ordem de publicação',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 100 },
        { name: 'accent', label: 'Destaque', type: 'text', maxLength: 100 },
        { name: 'body', label: 'Texto de apoio', type: 'textarea', maxLength: 600 },
        { name: 'label', label: 'Chamada superior', type: 'text', maxLength: 60 },
        { name: 'color', label: 'Cor', type: 'select', required: true, options: [...studioColors] },
        {
          name: 'layout',
          label: 'Composição',
          type: 'select',
          required: true,
          defaultValue: 'cover',
          options: [
            { label: 'Capa', value: 'cover' },
            { label: 'Quadro amarelo', value: 'signal' },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      label: 'Ordem no feed',
      type: 'number',
      defaultValue: 0,
      access: { create: editorField, update: editorField },
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
