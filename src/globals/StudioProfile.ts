import type { GlobalConfig } from 'payload'
import { invalidateStudio } from '@/lib/studio-invalidation'

export const StudioProfile: GlobalConfig = {
  slug: 'studio-profile',
  label: 'Perfil da Petasus',
  admin: { group: 'Petasus' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.collection === 'admins',
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        for (const field of ['emblem', 'avatar'] as const) {
          if (typeof data[field] !== 'string' || !data[field]) continue
          const media = await req.payload.findByID({
            collection: 'media',
            id: data[field],
            overrideAccess: false,
            user: req.user,
            req,
          })
          if (!media.mimeType?.startsWith('image/') || !media.width || !media.height) {
            throw new Error(
              field === 'avatar'
                ? 'Escolha uma imagem válida para a foto do perfil.'
                : 'Escolha uma imagem válida para o pégaso do rodapé.',
            )
          }
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        invalidateStudio()
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nome do perfil', type: 'text', maxLength: 64 },
    { name: 'bio', label: 'Bio', type: 'textarea', maxLength: 150 },
    {
      name: 'instagramPosts',
      label: 'Posts publicados no Instagram',
      type: 'number',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      validate: (value: unknown) =>
        value == null || Number.isSafeInteger(value) || 'Use um número inteiro.',
    },
    {
      name: 'followers',
      label: 'Seguidores no Instagram',
      type: 'number',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      validate: (value: unknown) =>
        value == null || Number.isSafeInteger(value) || 'Use um número inteiro.',
    },
    {
      name: 'following',
      label: 'Seguindo no Instagram',
      type: 'number',
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      validate: (value: unknown) =>
        value == null || Number.isSafeInteger(value) || 'Use um número inteiro.',
    },
    {
      name: 'avatar',
      label: 'Foto do perfil do Instagram',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: { description: 'Foto circular do perfil. Não altera o pégaso usado nas artes.' },
    },
    {
      name: 'emblem',
      label: 'Pégaso do rodapé',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
    },
  ],
}
