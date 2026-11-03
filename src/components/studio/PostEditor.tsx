'use client'

import { useState } from 'react'
import { saveStudioPost } from '@/app/(frontend)/actions'
import { studioCategories, studioColors, studioFormats } from '@/lib/studio-options'
import type { StudioPost, StudioSlide } from '@/lib/studio-types'

export function PostEditor({
  post,
  canEdit,
  onSaved,
  onCheckAccess,
}: {
  post: StudioPost | null
  canEdit: boolean
  onSaved: (post: StudioPost) => void
  onCheckAccess: () => void
}) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [accent, setAccent] = useState(post?.accent ?? '')
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? '')
  const [label, setLabel] = useState(post?.label ?? '')
  const [category, setCategory] = useState<StudioPost['category']>(
    post?.category ?? 'Presença digital',
  )
  const [color, setColor] = useState<StudioPost['color']>(post?.color ?? 'brown')
  const [format, setFormat] = useState<StudioPost['format']>(post?.format ?? 'Post estático')
  const [caption, setCaption] = useState(post?.caption ?? '')
  const [status, setStatus] = useState<StudioPost['status']>(post?.status ?? 'draft')
  const [extraSlides, setExtraSlides] = useState<StudioSlide[]>(post?.slides.slice(1) ?? [])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const updateSlide = (index: number, patch: Partial<StudioSlide>) =>
    setExtraSlides((slides) =>
      slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    )
  const emptySlide = (): StudioSlide => ({
    title: '',
    accent: '',
    body: '',
    label: '',
    color,
    layout: 'cover',
  })
  const fieldError = (name: string) =>
    fields[name] ? <span className="editor-field-error">{fields[name]}</span> : null

  return (
    <>
      <span className="eyebrow">ACERVO DA PETASUS</span>
      <h2>{post ? 'Editar post' : 'Criar post'}</h2>
      <p>
        O rascunho fica guardado. Marque como pronto quando a arte e a legenda estiverem aprovadas.
        Isso não publica no Instagram.
      </p>
      {!canEdit && (
        <div className="editor-access-notice">
          <strong>Salvamento protegido</strong>
          <p>
            Entre com seu acesso de edição do projeto. Depois, volte aqui e atualize o acesso sem
            perder o texto.
          </p>
          <a href="/admin" target="_blank" rel="noreferrer">
            Abrir painel de edição
          </a>
          <button type="button" onClick={onCheckAccess}>
            Já entrei, atualizar acesso
          </button>
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!canEdit || pending) return
          setPending(true)
          setError('')
          setFields({})
          try {
            const cover: StudioSlide = {
              title,
              accent,
              body: subtitle,
              label,
              color,
              layout: 'cover',
            }
            const result = await saveStudioPost({
              ...(post ? { id: post.id, updatedAt: post.updatedAt } : {}),
              title,
              accent,
              subtitle,
              label,
              category,
              color,
              format,
              caption,
              status,
              slides: [cover, ...(format === 'Carrossel' ? extraSlides : [])],
            })
            if (!result.success) {
              setError(result.error)
              setFields(result.fields ?? {})
              return
            }
            onSaved(result.data)
          } catch {
            setError('A conexão falhou. Seu texto continua aqui; tente salvar novamente.')
          } finally {
            setPending(false)
          }
        }}
      >
        <div className="editor-columns">
          <label>
            Tema
            <select
              aria-label="Tema"
              value={category}
              onChange={(e) => setCategory(e.target.value as StudioPost['category'])}
            >
              {studioCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {fieldError('category')}
          </label>
          <label>
            Formato
            <select
              aria-label="Formato"
              value={format}
              onChange={(e) => {
                const value = e.target.value as StudioPost['format']
                setFormat(value)
                if (value === 'Carrossel' && !extraSlides.length) setExtraSlides([emptySlide()])
              }}
            >
              {studioFormats.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {fieldError('format')}
          </label>
        </div>
        <div className="editor-section-heading">
          <strong>01 / Capa</strong>
          <span>1080 × 1350 px</span>
        </div>
        <label>
          Título do post
          <input
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Qual é a ideia do post?"
          />
          {fieldError('title')}
        </label>
        <label>
          Trecho em destaque
          <input
            maxLength={100}
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            placeholder="A parte que aparece em itálico"
          />
          {fieldError('accent')}
        </label>
        <label htmlFor="post-subtitle">Texto de apoio</label>
        <textarea
          id="post-subtitle"
          maxLength={600}
          rows={3}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        {fieldError('subtitle')}
        <div className="editor-columns">
          <label>
            Chamada superior
            <input
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex.: SITES NO CELULAR"
            />
            {fieldError('label')}
          </label>
          <label>
            Cor da capa
            <select
              aria-label="Cor da capa"
              value={color}
              onChange={(e) => setColor(e.target.value as StudioPost['color'])}
            >
              {studioColors.map((item) => (
                <option key={item} value={item}>
                  {{ brown: 'Marrom', cream: 'Off-white', yellow: 'Amarelo', blue: 'Azul' }[item]}
                </option>
              ))}
            </select>
            {fieldError('color')}
          </label>
        </div>
        {format === 'Carrossel' && (
          <div className="editor-slides">
            {extraSlides.map((slide, index) => (
              <fieldset key={index} className="editor-slide">
                <legend>Slide {index + 2}</legend>
                <label>
                  Título do slide {index + 2}
                  <input
                    required
                    maxLength={100}
                    value={slide.title}
                    onChange={(e) => updateSlide(index, { title: e.target.value })}
                  />
                  {fieldError(`slides.${index + 1}.title`)}
                </label>
                <label>
                  Destaque do slide {index + 2}
                  <input
                    maxLength={100}
                    value={slide.accent}
                    onChange={(e) => updateSlide(index, { accent: e.target.value })}
                  />
                </label>
                <label htmlFor={`slide-body-${index}`}>Texto do slide {index + 2}</label>
                <textarea
                  id={`slide-body-${index}`}
                  maxLength={600}
                  rows={3}
                  value={slide.body}
                  onChange={(e) => updateSlide(index, { body: e.target.value })}
                />
                {fieldError(`slides.${index + 1}.body`)}
                <label>
                  Chamada do slide {index + 2}
                  <input
                    maxLength={60}
                    value={slide.label}
                    onChange={(e) => updateSlide(index, { label: e.target.value })}
                  />
                </label>
                <div className="editor-columns">
                  <label>
                    Cor do slide {index + 2}
                    <select
                      aria-label={`Cor do slide ${index + 2}`}
                      value={slide.color}
                      onChange={(e) =>
                        updateSlide(index, { color: e.target.value as StudioSlide['color'] })
                      }
                    >
                      {studioColors.map((item) => (
                        <option key={item} value={item}>
                          {
                            {
                              brown: 'Marrom',
                              cream: 'Off-white',
                              yellow: 'Amarelo',
                              blue: 'Azul',
                            }[item]
                          }
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Composição do slide {index + 2}
                    <select
                      aria-label={`Composição do slide ${index + 2}`}
                      value={slide.layout}
                      onChange={(e) =>
                        updateSlide(index, { layout: e.target.value as StudioSlide['layout'] })
                      }
                    >
                      <option value="cover">Texto livre</option>
                      <option value="signal">Quadro amarelo</option>
                    </select>
                  </label>
                </div>
                <button
                  className="editor-remove-slide"
                  type="button"
                  disabled={extraSlides.length <= 1}
                  onClick={() => setExtraSlides((slides) => slides.filter((_, i) => i !== index))}
                >
                  Remover este slide
                </button>
              </fieldset>
            ))}
            <button
              className="export-button"
              type="button"
              disabled={extraSlides.length >= 9}
              onClick={() => setExtraSlides((slides) => [...slides, emptySlide()])}
            >
              Adicionar slide ({extraSlides.length + 1}/10)
            </button>
            {fieldError('slides')}
          </div>
        )}
        <label htmlFor="post-caption">Legenda do Instagram</label>
        <textarea
          id="post-caption"
          maxLength={2200}
          rows={6}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Escreva a legenda que acompanha a arte."
        />
        <span className="bio-counter">{caption.length}/2200</span>
        {fieldError('caption')}
        <label>
          Etapa
          <select
            aria-label="Etapa"
            value={status}
            onChange={(e) => setStatus(e.target.value as StudioPost['status'])}
          >
            <option value="draft">Rascunho — continuar depois</option>
            <option value="published">Pronto para baixar — aprovado</option>
          </select>
          {fieldError('status')}
        </label>
        <p className="editor-publish-note">
          “Pronto” coloca o post na prévia compartilhada. Rascunhos só aparecem para quem tem acesso
          de edição.
        </p>
        {error && (
          <div className="editor-error" role="alert">
            {error}
          </div>
        )}
        <button
          className="primary-button"
          type="submit"
          disabled={pending || !canEdit || !title.trim()}
        >
          {pending ? 'Salvando…' : post ? 'Salvar alterações' : 'Salvar no acervo'}
        </button>
      </form>
    </>
  )
}
