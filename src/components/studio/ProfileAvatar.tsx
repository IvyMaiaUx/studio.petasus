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
  const avatarSrc = image?.url || '/assets/petasus-instagram-profile.png'
  const size = large ? 116 : 32
  return (
    <span
      className={`${className} has-profile-image`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <Image
        src={avatarSrc}
        alt={image?.alt || 'Foto do perfil da Petasus'}
        width={large ? 150 : 40}
        height={large ? 150 : 40}
        sizes={large ? '150px' : '40px'}
        loading="eager"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          display: 'block',
        }}
      />
    </span>
  )
}
