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
  return (
    <span className={`${className} has-profile-image`}>
      <Image
        src={avatarSrc}
        alt={image?.alt || 'Foto do perfil da Petasus'}
        width={image?.width || (large ? 150 : 40)}
        height={image?.height || (large ? 150 : 40)}
        sizes={large ? '150px' : '40px'}
        loading="eager"
        style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%' }}
      />
    </span>
  )
}
