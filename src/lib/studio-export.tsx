'use client'

import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { toBlob, getFontEmbedCSS } from 'html-to-image'
import JSZip from 'jszip'
import { PostArt } from '@/components/studio/PostArt'
import { HighlightArt } from '@/components/studio/HighlightArt'
import type { StudioPost, StudioBrand, StudioHighlight } from '@/lib/studio-types'
import type { ReactNode } from 'react'

function filename(post: StudioPost) {
  return (
    `${post.title} ${post.accent}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'post'
  )
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}
async function renderArtwork(element: ReactNode, story = false) {
  const host = document.createElement('div')
  host.className = `studio-export-stage ${story ? 'studio-export-story' : ''}`
  document.body.append(host)
  const root = createRoot(host)
  try {
    flushSync(() => root.render(element))
    await document.fonts.ready
    await Promise.all([...host.querySelectorAll('img')].map((image) => image.decode()))
    const art = host.firstElementChild as HTMLElement
    const fontEmbedCSS = await getFontEmbedCSS(art)
    const blob = await toBlob(art, {
      width: 540,
      height: story ? 960 : 675,
      pixelRatio: 2,
      fontEmbedCSS,
      preferredFontFormat: 'woff2',
    })
    if (!blob) throw new Error('Não foi possível gerar a imagem.')
    return blob
  } finally {
    root.unmount()
    host.remove()
  }
}

async function renderPng(post: StudioPost, slide: number, brand: StudioBrand) {
  return renderArtwork(<PostArt post={post} slide={slide} emblem={brand.emblem} />)
}

export async function downloadPostPng(post: StudioPost, slide: number, brand: StudioBrand) {
  const blob = await renderPng(post, slide, brand)
  download(blob, `petasus-${filename(post)}-${String(slide + 1).padStart(2, '0')}.png`)
}

export async function downloadPostsZip(
  posts: StudioPost[],
  brand: StudioBrand,
  onProgress: (label: string) => void,
) {
  if (!posts.length) throw new Error('Não há posts para baixar.')
  const zip = new JSZip()
  const count = posts.reduce((total, post) => total + post.slides.length, 0)
  let completed = 0
  for (const [index, post] of posts.entries()) {
    const folderName =
      posts.length > 1 ? `${String(index + 1).padStart(2, '0')}-${filename(post)}` : filename(post)
    const folder = zip.folder(folderName)!
    for (let slide = 0; slide < post.slides.length; slide++) {
      onProgress(`Gerando arte ${completed + 1} de ${count}…`)
      folder.file(`${String(slide + 1).padStart(2, '0')}.png`, await renderPng(post, slide, brand))
      completed++
    }
    folder.file('legenda.txt', post.caption)
  }
  zip.file(
    'LEIA-ME.txt',
    'Petasus Studio\nArtes em PNG, 1080 × 1350 px (4:5).\nEm cada pasta, publique os slides na ordem numérica e use o texto de legenda.txt.\nNenhuma publicação foi enviada automaticamente ao Instagram.\n',
  )
  onProgress('Preparando ZIP…')
  download(
    await zip.generateAsync({ type: 'blob', compression: 'STORE' }),
    posts.length === 1 ? `petasus-${filename(posts[0])}.zip` : 'petasus-posts.zip',
  )
}

function highlightFilename(highlight: StudioHighlight) {
  return (
    highlight.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'destaque'
  )
}

export function highlightScript(highlight: StudioHighlight) {
  return `${highlight.name}\n\n${highlight.stories.map((story, i) => `STORY ${String(i + 1).padStart(2, '0')}\n${story.title} ${story.accent}\n\n${story.body}`).join('\n\n---\n\n')}`
}

export async function downloadHighlightPng(
  highlight: StudioHighlight,
  story: number,
  brand: StudioBrand,
) {
  if (story >= highlight.stories.length || story < -1) throw new Error('Story inválido.')
  const blob = await renderArtwork(
    <HighlightArt highlight={highlight} story={story} emblem={brand.emblem} />,
    true,
  )
  download(
    blob,
    `petasus-${highlightFilename(highlight)}-${story < 0 ? 'capa' : `story-${String(story + 1).padStart(2, '0')}`}.png`,
  )
}

export async function downloadHighlightsZip(
  highlights: StudioHighlight[],
  brand: StudioBrand,
  onProgress: (label: string) => void,
  coversOnly = false,
) {
  if (!highlights.length) throw new Error('Não há destaques para baixar.')
  const zip = new JSZip()
  let progress = 0
  const total = highlights.reduce(
    (sum, highlight) => sum + 1 + (coversOnly ? 0 : highlight.stories.length),
    0,
  )
  for (const [index, highlight] of highlights.entries()) {
    const folder = zip.folder(
      `${String(index + 1).padStart(2, '0')}-${highlightFilename(highlight)}`,
    )!
    onProgress(`Gerando capa ${++progress} de ${total}…`)
    folder.file(
      '00-capa.png',
      await renderArtwork(
        <HighlightArt highlight={highlight} story={-1} emblem={brand.emblem} />,
        true,
      ),
    )
    if (!coversOnly) {
      for (let story = 0; story < highlight.stories.length; story++) {
        onProgress(`Gerando story ${++progress} de ${total}…`)
        folder.file(
          `${String(story + 1).padStart(2, '0')}-story.png`,
          await renderArtwork(
            <HighlightArt highlight={highlight} story={story} emblem={brand.emblem} />,
            true,
          ),
        )
      }
      folder.file('roteiro.txt', highlightScript(highlight))
    }
  }
  zip.file(
    'LEIA-ME.txt',
    'Petasus · Destaques\nCapas e stories em PNG, 1080 × 1920 px (9:16).\nO símbolo da capa está centralizado para o recorte circular do Instagram.\nPublique os stories na ordem numérica, adicione-os ao destaque e escolha 00-capa.png como capa.\nNenhum conteúdo foi publicado automaticamente no Instagram.\n',
  )
  onProgress('Preparando ZIP…')
  download(
    await zip.generateAsync({ type: 'blob', compression: 'STORE' }),
    coversOnly
      ? 'petasus-capas-destaques.zip'
      : highlights.length === 1
        ? `petasus-destaque-${highlightFilename(highlights[0])}.zip`
        : 'petasus-destaques.zip',
  )
}
