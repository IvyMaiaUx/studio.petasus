import type { SocialPost, Media, StudioProfile, SocialHighlight } from '@/payload-types'

export type StudioSlide = {
  title: string
  accent: string
  body: string
  label: string
  color: SocialPost['color']
  layout: 'cover' | 'signal'
}
export type StudioPost = {
  id: SocialPost['id']
  title: string
  accent: string
  subtitle: string
  category: SocialPost['category']
  format: SocialPost['format']
  color: SocialPost['color']
  label: string
  caption: string
  slides: StudioSlide[]
  status: 'draft' | 'published'
  updatedAt: string
}
export type StudioBrand = {
  name: string
  bio: string
  instagramPosts: number
  followers: number
  following: number
  avatar: { url: string; alt: string; width: number; height: number } | null
  emblem: { url: string; alt: string; width: number; height: number } | null
}
export type SavePostInput = Omit<StudioPost, 'id' | 'updatedAt'> & {
  id?: SocialPost['id']
  updatedAt?: string
}
export type MutationResult<T> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      fields?: Record<string, string>
    }

export type HighlightStory = {
  title: string
  accent: string
  body: string
  color: SocialHighlight['color']
}
export type StudioHighlight = {
  id: SocialHighlight['id']
  name: string
  icon: SocialHighlight['icon']
  color: SocialHighlight['color']
  category: SocialHighlight['category']
  stories: HighlightStory[]
  sortOrder: number
  status: 'draft' | 'published'
  updatedAt: string
}
export function toStudioHighlight(highlight: SocialHighlight): StudioHighlight {
  return {
    id: highlight.id,
    name: highlight.name,
    icon: highlight.icon,
    color: highlight.color,
    category: highlight.category,
    sortOrder: highlight.sortOrder ?? 0,
    status: highlight._status === 'published' ? 'published' : 'draft',
    updatedAt: highlight.updatedAt,
    stories: (highlight.stories ?? []).map((story) => ({
      title: story.title,
      accent: story.accent ?? '',
      body: story.body ?? '',
      color: story.color,
    })),
  }
}

export function toStudioPost(post: SocialPost): StudioPost {
  return {
    id: post.id,
    title: post.title,
    accent: post.accent ?? '',
    subtitle: post.subtitle ?? '',
    label: post.label ?? '',
    category: post.category,
    color: post.color,
    format: post.format,
    caption: post.caption ?? '',
    status: post._status === 'published' ? 'published' : 'draft',
    updatedAt: post.updatedAt,
    slides: (post.slides ?? []).map((slide) => ({
      title: slide.title,
      accent: slide.accent ?? '',
      body: slide.body ?? '',
      label: slide.label ?? '',
      color: slide.color,
      layout: slide.layout === 'signal' ? 'signal' : 'cover',
    })),
  }
}
export function toStudioBrand(profile: StudioProfile): StudioBrand {
  const image = typeof profile.emblem === 'object' ? (profile.emblem as Media | null) : null
  const avatar = typeof profile.avatar === 'object' ? (profile.avatar as Media | null) : null
  return {
    name: profile.name ?? '',
    bio: profile.bio ?? '',
    instagramPosts: profile.instagramPosts ?? 0,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    avatar: avatar?.url
      ? {
          url: avatar.url,
          alt: avatar.alt,
          width: avatar.width || 1000,
          height: avatar.height || 1000,
        }
      : null,
    emblem: {
      url: image?.url || '/assets/petasus-pegasus.jpg',
      alt: image?.alt || 'Pégaso Petasus',
      width: image?.width || 1184,
      height: image?.height || 880,
    },
  }
}
