import Studio from '@/components/studio/Studio'
import { getPublicStudio } from '@/lib/studio-data'

export default async function HomePage() {
  const { posts, brand, highlights } = await getPublicStudio()
  return <Studio initialPosts={posts} initialBrand={brand} initialHighlights={highlights} />
}
