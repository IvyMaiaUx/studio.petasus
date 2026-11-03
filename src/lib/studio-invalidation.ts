import { revalidateTag } from 'next/cache'

export function invalidateStudio() {
  try {
    revalidateTag('petasus-studio', { expire: 0 })
  } catch (error) {
    // The content CLI runs the same hooks without a Next request/cache store.
    if (error instanceof Error && /static generation store|incremental cache/i.test(error.message))
      return
    throw error
  }
}
