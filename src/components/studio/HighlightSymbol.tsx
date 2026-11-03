import Image from 'next/image'
import { Icon } from './Icon'
import type { StudioHighlight, StudioBrand } from '@/lib/studio-types'

export function HighlightSymbol({
  name,
  emblem,
  size = 24,
}: {
  name: StudioHighlight['icon']
  emblem: StudioBrand['emblem']
  size?: number
}) {
  if (name === 'pegasus') {
    return emblem ? (
      <Image
        className="highlight-pegasus"
        src={emblem.url}
        alt=""
        width={emblem.width}
        height={emblem.height}
        loading="eager"
      />
    ) : (
      <span className="highlight-symbol-fallback">P</span>
    )
  }
  return <Icon name={name} size={size} />
}
