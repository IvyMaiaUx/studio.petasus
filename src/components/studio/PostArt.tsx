import Image from 'next/image'
import type { StudioPost, StudioBrand } from '@/lib/studio-types'

export function PostArt({
  post,
  slide = 0,
  emblem,
}: {
  post: StudioPost
  slide?: number
  emblem: StudioBrand['emblem']
}) {
  const art = post.slides[slide] ?? {
    title: post.title,
    accent: post.accent,
    body: post.subtitle,
    label: post.label,
    color: post.color,
    layout: 'cover',
  }
  const scale = Math.min(
    1,
    Math.sqrt(240 / Math.max(240, art.title.length + art.accent.length + art.body.length)),
  )
  const titleSize = art.layout === 'signal' ? 9.3 : 12.6
  const bodySize = art.layout === 'signal' ? 4.1 : 3.75
  const labelSize = Math.min(
    art.layout === 'signal' ? 2.7 : 3.1,
    82 / Math.max(1, art.label.length * 0.6),
  )
  return (
    <div className={`post-art ${art.color} ${art.layout === 'signal' ? 'signal' : ''}`}>
      <div className="art-inner">
        <div className="art-eyebrow" style={{ fontSize: `${labelSize}cqw` }}>
          {art.label}
        </div>
        <div className="art-copy">
          <h2 style={{ fontSize: `${titleSize * scale}cqw` }}>
            {art.title} <em>{art.accent}</em>
          </h2>
          <p style={{ fontSize: `${bodySize * scale}cqw` }}>{art.body}</p>
        </div>
      </div>
      <div className="art-footer">
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
        <span>
          {post.format === 'Carrossel'
            ? slide
              ? `${slide + 1}/${post.slides.length}`
              : 'arraste →'
            : 'petasus.digital'}
        </span>
      </div>
    </div>
  )
}
