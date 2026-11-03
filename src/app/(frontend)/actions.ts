'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { studioCategories, studioColors, studioFormats, highlightIcons } from '@/lib/studio-options'
import {
  toStudioPost,
  toStudioBrand,
  type MutationResult,
  type StudioPost,
  type StudioBrand,
  toStudioHighlight,
  type StudioHighlight,
} from '@/lib/studio-types'
import { listStudioPosts, listStudioHighlights } from '@/lib/studio-data'

async function editorSession() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  return { payload, user: user?.collection === 'admins' ? user : null }
}

export async function getStudioSession() {
  const { payload, user } = await editorSession()
  const [posts, profile, highlights] = await Promise.all([
    listStudioPosts(user),
    payload.findGlobal({
      slug: 'studio-profile',
      overrideAccess: false,
      user: user ?? undefined,
      depth: 1,
    }),
    listStudioHighlights(user),
  ])
  return { canEdit: Boolean(user), posts, brand: toStudioBrand(profile), highlights }
}

function text(
  value: unknown,
  name: string,
  max: number,
  errors: Record<string, string>,
  required = false,
) {
  if (typeof value !== 'string') {
    if (required || value != null) errors[name] = 'Preencha este campo com texto.'
    return ''
  }
  const result = value.trim()
  if ((required && !result) || result.length > max)
    errors[name] = `Use ${required ? 'de 1 a' : 'até'} ${max} caracteres.`
  return result
}

export async function saveStudioPost(input: unknown): Promise<MutationResult<StudioPost>> {
  try {
    const { payload, user } = await editorSession()
    if (!user)
      return { success: false, error: 'Entre no painel de edição do projeto para salvar posts.' }
    if (!input || typeof input !== 'object' || Array.isArray(input))
      return { success: false, error: 'Post inválido.' }
    const value = input as Record<string, unknown>,
      errors: Record<string, string> = {}
    const title = text(value.title, 'title', 100, errors, true)
    const accent = text(value.accent, 'accent', 100, errors)
    const subtitle = text(value.subtitle, 'subtitle', 600, errors)
    const label = text(value.label, 'label', 60, errors)
    const caption = text(value.caption, 'caption', 2200, errors)
    const category = studioCategories.find((option) => option === value.category)
    const color = studioColors.find((option) => option === value.color)
    const format = studioFormats.find((option) => option === value.format)
    if (!category) errors.category = 'Escolha um tema válido.'
    if (!color) errors.color = 'Escolha uma cor válida.'
    if (!format) errors.format = 'Escolha um formato válido.'
    if (value.status !== 'draft' && value.status !== 'published')
      errors.status = 'Escolha rascunho ou pronto.'
    const rawSlides = Array.isArray(value.slides) ? value.slides : []
    if (
      rawSlides.length < 1 ||
      rawSlides.length > 10 ||
      (format === 'Carrossel' && rawSlides.length < 2) ||
      (format === 'Post estático' && rawSlides.length !== 1)
    )
      errors.slides = 'Use uma arte no post estático ou de 2 a 10 no carrossel.'
    const slides = rawSlides.slice(0, 10).map((raw, index) => {
      const s =
        raw && typeof raw === 'object' && !Array.isArray(raw)
          ? (raw as Record<string, unknown>)
          : {}
      const slideColor = studioColors.find((option) => option === s.color)
      if (!slideColor) errors[`slides.${index}.color`] = 'Escolha uma cor válida.'
      if (s.layout !== 'cover' && s.layout !== 'signal')
        errors[`slides.${index}.layout`] = 'Composição inválida.'
      return {
        title: text(s.title, `slides.${index}.title`, 100, errors, true),
        accent: text(s.accent, `slides.${index}.accent`, 100, errors),
        body: text(s.body, `slides.${index}.body`, 600, errors),
        label: text(s.label, `slides.${index}.label`, 60, errors),
        color: slideColor ?? ('brown' as const),
        layout: s.layout === 'signal' ? ('signal' as const) : ('cover' as const),
      }
    })
    if (value.id != null && (typeof value.id !== 'string' || !value.id.trim()))
      errors.id = 'Identificador inválido.'
    if (Object.keys(errors).length || !category || !color || !format)
      return {
        success: false,
        error: 'Confira os campos indicados antes de salvar.',
        fields: errors,
      }
    slides[0] = { title, accent, body: subtitle, label, color, layout: 'cover' }
    const data = {
      title,
      accent,
      subtitle,
      label,
      caption,
      category,
      color,
      format,
      slides,
      _status: value.status as 'draft' | 'published',
    }
    if (typeof value.id === 'string') {
      const current = await payload.findByID({
        collection: 'social-posts',
        id: value.id,
        overrideAccess: false,
        user,
        draft: true,
        depth: 0,
      })
      if (value.updatedAt !== current.updatedAt)
        return {
          success: false,
          error:
            'Este post foi alterado em outro lugar. Feche e atualize o acervo antes de editar novamente.',
        }
      const post = await payload.update({
        collection: 'social-posts',
        id: current.id,
        overrideAccess: false,
        user,
        draft: data._status === 'draft',
        data,
      })
      return { success: true, data: toStudioPost(post) }
    }
    const post = await payload.create({
      collection: 'social-posts',
      overrideAccess: false,
      user,
      draft: data._status === 'draft',
      data,
    })
    return { success: true, data: toStudioPost(post) }
  } catch (error) {
    const fields: Record<string, string> = {}
    if (error && typeof error === 'object' && 'data' in error) {
      const data = error.data as { errors?: { path?: string; message?: string }[] }
      for (const item of data?.errors ?? [])
        if (item.path && item.message) fields[item.path] = item.message
    }
    return {
      success: false,
      error: 'Não foi possível salvar o post. Seu texto continua no editor; tente novamente.',
      fields,
    }
  }
}

export async function saveStudioProfile(input: unknown): Promise<MutationResult<StudioBrand>> {
  try {
    const { payload, user } = await editorSession()
    if (!user)
      return { success: false, error: 'Entre no painel de edição do projeto para salvar o perfil.' }
    if (!input || typeof input !== 'object') return { success: false, error: 'Perfil inválido.' }
    const value = input as Record<string, unknown>,
      errors: Record<string, string> = {}
    const name = text(value.name, 'name', 64, errors, true)
    const bio = text(value.bio, 'bio', 150, errors, true)
    for (const [key, label] of [
      ['instagramPosts', 'Posts'],
      ['followers', 'Seguidores'],
      ['following', 'Seguindo'],
    ] as const) {
      if (typeof value[key] !== 'number' || !Number.isSafeInteger(value[key]) || value[key] < 0)
        errors[key] = `${label}: use um número inteiro a partir de 0.`
    }
    if (Object.keys(errors).length)
      return { success: false, error: 'Confira os dados do perfil.', fields: errors }
    const profile = await payload.updateGlobal({
      slug: 'studio-profile',
      overrideAccess: false,
      user,
      data: {
        name,
        bio,
        instagramPosts: value.instagramPosts as number,
        followers: value.followers as number,
        following: value.following as number,
      },
      depth: 1,
    })
    return { success: true, data: toStudioBrand(profile) }
  } catch {
    return { success: false, error: 'Não foi possível salvar o perfil. Tente novamente.' }
  }
}

export async function saveStudioHighlight(
  input: unknown,
): Promise<MutationResult<StudioHighlight>> {
  try {
    const { payload, user } = await editorSession()
    if (!user)
      return { success: false, error: 'Entre no painel de edição para salvar os destaques.' }
    if (!input || typeof input !== 'object' || Array.isArray(input))
      return { success: false, error: 'Destaque inválido.' }
    const value = input as Record<string, unknown>,
      errors: Record<string, string> = {}
    const name = text(value.name, 'name', 15, errors, true)
    const icon = highlightIcons.find((item) => item === value.icon)
    const color = studioColors.find((item) => item === value.color)
    const category = studioCategories.find((item) => item === value.category)
    if (!icon) errors.icon = 'Escolha um ícone válido.'
    if (!color) errors.color = 'Escolha uma cor válida.'
    if (!category) errors.category = 'Escolha um tema válido.'
    if (value.status !== 'draft' && value.status !== 'published')
      errors.status = 'Escolha rascunho ou pronto.'
    const sortOrder = value.sortOrder
    if (
      typeof sortOrder !== 'number' ||
      !Number.isInteger(sortOrder) ||
      sortOrder < 0 ||
      sortOrder > 999
    )
      errors.sortOrder = 'Use um número inteiro entre 0 e 999.'
    const rawStories = Array.isArray(value.stories) ? value.stories : []
    if (rawStories.length < 1 || rawStories.length > 20) errors.stories = 'Use de 1 a 20 stories.'
    const stories = rawStories.slice(0, 20).map((raw, index) => {
      const story =
        raw && typeof raw === 'object' && !Array.isArray(raw)
          ? (raw as Record<string, unknown>)
          : {}
      const storyColor = studioColors.find((item) => item === story.color)
      if (!storyColor) errors[`stories.${index}.color`] = 'Escolha uma cor válida.'
      return {
        title: text(story.title, `stories.${index}.title`, 100, errors, true),
        accent: text(story.accent, `stories.${index}.accent`, 80, errors),
        body: text(story.body, `stories.${index}.body`, 450, errors),
        color: storyColor ?? ('yellow' as const),
      }
    })
    if (value.id != null && (typeof value.id !== 'string' || !value.id.trim()))
      errors.id = 'Identificador inválido.'
    if (Object.keys(errors).length || !icon || !color || !category || typeof sortOrder !== 'number')
      return { success: false, error: 'Confira os campos indicados.', fields: errors }
    const data = {
      name,
      icon,
      color,
      category,
      sortOrder,
      stories,
      _status: value.status as 'draft' | 'published',
    }
    if (typeof value.id === 'string') {
      const current = await payload.findByID({
        collection: 'social-highlights',
        id: value.id,
        draft: true,
        overrideAccess: false,
        user,
        depth: 0,
      })
      if (value.updatedAt !== current.updatedAt)
        return {
          success: false,
          error:
            'Este destaque foi alterado em outro lugar. Atualize o acervo antes de editar novamente.',
        }
      const doc = await payload.update({
        collection: 'social-highlights',
        id: current.id,
        data,
        draft: data._status === 'draft',
        overrideAccess: false,
        user,
      })
      return { success: true, data: toStudioHighlight(doc) }
    }
    const doc = await payload.create({
      collection: 'social-highlights',
      data,
      draft: data._status === 'draft',
      overrideAccess: false,
      user,
    })
    return { success: true, data: toStudioHighlight(doc) }
  } catch (error) {
    const fields: Record<string, string> = {}
    if (error && typeof error === 'object' && 'data' in error) {
      const data = error.data as { errors?: { path?: string; message?: string }[] }
      for (const item of data?.errors ?? [])
        if (item.path && item.message) fields[item.path] = item.message
    }
    return {
      success: false,
      error: 'Não foi possível salvar. Seu conteúdo continua no editor; tente novamente.',
      fields,
    }
  }
}
