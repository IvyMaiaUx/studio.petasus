import Image from 'next/image'
import { HighlightSymbol } from './HighlightSymbol'
import type { StudioHighlight, StudioBrand } from '@/lib/studio-types'

export function HighlightArt({
  highlight,
  story = -1,
  emblem,
}: {
  highlight: StudioHighlight
  story?: number
  emblem: StudioBrand['emblem']
}) {
  const content = story >= 0 ? highlight.stories[story] : null
  const color = content?.color ?? highlight.color
  const length =
    (content?.title.length ?? 0) + (content?.accent.length ?? 0) + (content?.body.length ?? 0)
  const scale = length > 200 ? Math.sqrt(180 / length) : 1
  return (
    <div
      className={`highlight-art ${color} ${content ? 'highlight-story-art' : 'highlight-cover-art'}`}
    >
      <div className="highlight-art-top">
        <span>PETASUS</span>
        <span>{highlight.name}</span>
      </div>
      {content ? (
        <div className="highlight-art-copy">
          <HighlightSymbol name={highlight.icon} emblem={emblem} size={32} />
          <h2 style={{ fontSize: `${11 * scale}cqw` }}>
            {content.title} <em>{content.accent}</em>
          </h2>
          <p style={{ fontSize: `${4.15 * scale}cqw` }}>{content.body}</p>
        </div>
      ) : (
        <div className="highlight-cover-center">
          <span>
            <HighlightSymbol name={highlight.icon} emblem={emblem} size={90} />
          </span>
        </div>
      )}
      <div className="highlight-art-footer">
        <span className="art-brand">
          {emblem && (
            <Image
              src={emblem.url}
              alt=""
              width={emblem.width}
              height={emblem.height}
              loading="eager"
            />
          )}
          Petasus
        </span>
        <span>{content ? `${story + 1}/${highlight.stories.length}` : '@petasus.digital'}</span>
      </div>
    </div>
  )
}
