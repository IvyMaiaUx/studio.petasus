import Image from 'next/image'
import type { StudioBrand } from '@/lib/studio-types'

export function ProfileAvatar({
  image,
  className,
  large = false,
}: {
  image: StudioBrand['avatar']
  className: string
  large?: boolean
}) {
  return (
    <span className={`${className}${image ? ' has-profile-image' : ''}`}>
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={large ? '120px' : '32px'}
          loading="eager"
        />
      ) : (
        <>P{large && <span>®</span>}</>
      )}
    </span>
  )
}
