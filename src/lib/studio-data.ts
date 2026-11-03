import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { toStudioBrand, toStudioPost, toStudioHighlight } from '@/lib/studio-types'
import type { Admin, SocialPost, SocialHighlight } from '@/payload-types'

export async function listStudioPosts(user?: Admin | null) {
  const payload = await getPayloadClient()
  const documents: SocialPost[] = []
  let page = 1
  while (true) {
    const result = await payload.find({
      collection: 'social-posts',
      overrideAccess: false,
      user: user ?? undefined,
      draft: Boolean(user),
      where: user ? undefined : { _status: { equals: 'published' } },
      sort: ['sortOrder', '-createdAt'],
      limit: 100,
      page,
      depth: 0,
    })
    documents.push(...result.docs)
    if (!result.hasNextPage) break
    page++
  }
  return documents.map(toStudioPost)
}

export async function listStudioHighlights(user?: Admin | null) {
  const payload = await getPayloadClient()
  const documents: SocialHighlight[] = []
  let page = 1
  while (true) {
    const result = await payload.find({
      collection: 'social-highlights',
      overrideAccess: false,
      user: user ?? undefined,
      draft: Boolean(user),
      where: user ? undefined : { _status: { equals: 'published' } },
      sort: ['sortOrder', 'createdAt'],
      limit: 100,
      page,
      depth: 0,
    })
    documents.push(...result.docs)
    if (!result.hasNextPage) break
    page++
  }
  return documents.map(toStudioHighlight)
}

export const getPublicStudio = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const [posts, profile, highlights] = await Promise.all([
      listStudioPosts(),
      payload.findGlobal({ slug: 'studio-profile', overrideAccess: false, depth: 1 }),
      listStudioHighlights(),
    ])
    return { posts, brand: toStudioBrand(profile), highlights }
  },
  ['petasus-studio-v4'],
  { tags: ['petasus-studio'] },
)
