import type { ReactNode } from 'react'
export type IconName =
  | 'grid'
  | 'spark'
  | 'palette'
  | 'arrow'
  | 'down'
  | 'plus'
  | 'download'
  | 'instagram'
  | 'layers'
  | 'check'
  | 'close'
  | 'external'
  | 'list'
  | 'heart'
  | 'bookmark'
  | 'chevron'
  | 'tag'
  | 'link'
type IconProps = {
  name: IconName
  size?: number
}
export function Icon({ name, size = 20 }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
        <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.5 1.5 0 0 1 1.1-2.5H18A4 4 0 0 0 22 10c0-4-5-7-10-7Z" />
        <circle cx="7" cy="11" r=".7" />
        <circle cx="10" cy="7" r=".7" />
        <circle cx="15" cy="7" r=".7" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    down: <path d="m7 10 5 5 5-5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".5" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    external: (
      <>
        <path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-6" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    bookmark: <path d="M5 3h14v18l-7-4-7 4V3Z" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    tag: (
      <>
        <path d="m12 3 9 6v12H3V9l9-6Z" />
        <circle cx="12" cy="11" r="2.5" />
        <path d="M7 20v-1a5 5 0 0 1 10 0v1" />
      </>
    ),
    link: (
      <>
        <path d="m10 13 4-4m-6 8-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
