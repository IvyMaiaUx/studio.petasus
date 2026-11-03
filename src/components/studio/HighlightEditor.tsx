'use client'

import { useState } from 'react'
import { saveStudioHighlight } from '@/app/(frontend)/actions'
import { studioCategories, studioColors, highlightIcons } from '@/lib/studio-options'
import type { StudioHighlight, HighlightStory, StudioBrand } from '@/lib/studio-types'
import { HighlightArt } from './HighlightArt'
import { Icon } from './Icon'
import { HighlightSymbol } from './HighlightSymbol'

const colorNames = { brown: 'Marrom', cream: 'Off-white', yellow: 'Amarelo', blue: 'Azul' }
const iconNames = {
  pegasus: 'Cavalinho da Petasus',
  spark: 'Estrela',
  layers: 'Camadas',
  grid: 'Grade',
  palette: 'Paleta',
  arrow: 'Seta',
  heart: 'Coração',
  instagram: 'Instagram',
  bookmark: 'Marcador',
}

export function HighlightEditor({
  highlight,
  brand,
  canEdit,
  onCheckAccess,
  onSaved,
}: {
  highlight: StudioHighlight | null
  brand: StudioBrand
  canEdit: boolean
  onCheckAccess: () => void
  onSaved: (highlight: StudioHighlight) => void
}) {
  const [name, setName] = useState(highlight?.name ?? '')
  const [icon, setIcon] = useState<StudioHighlight['icon']>(highlight?.icon ?? 'spark')
  const [color, setColor] = useState<StudioHighlight['color']>(highlight?.color ?? 'yellow')
  const [category, setCategory] = useState<StudioHighlight['category']>(
    highlight?.category ?? 'Petasus por perto',
  )
  const [order, setOrder] = useState(highlight?.sortOrder ?? 1)
  const [status, setStatus] = useState<StudioHighlight['status']>(highlight?.status ?? 'draft')
  const [stories, setStories] = useState<HighlightStory[]>(
    highlight?.stories ?? [{ title: '', accent: '', body: '', color: 'yellow' }],
  )
  const [preview, setPreview] = useState(-1)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const updateStory = (index: number, patch: Partial<HighlightStory>) =>
    setStories((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  const moveStory = (index: number, direction: number) => {
    const next = index + direction
    if (next < 0 || next >= stories.length) return
    setStories((items) => {
      const result = [...items]
      ;[result[index], result[next]] = [result[next], result[index]]
      return result
    })
    setPreview(next)
  }
  const previewHighlight: StudioHighlight = {
    id: highlight?.id ?? -1,
    name: name || 'Novo destaque',
    icon,
    color,
    category,
    sortOrder: order,
    status,
    stories,
    updatedAt: highlight?.updatedAt ?? '',
  }
  const fieldError = (key: string) =>
    fields[key] ? <span className="editor-field-error">{fields[key]}</span> : null
  return (
    <>
      <span className="eyebrow">DESTAQUES DA PETASUS</span>
      <h2>{highlight ? 'Editar destaque' : 'Novo destaque'}</h2>
      <p>
        A capa aparece no círculo do perfil. Os stories ficam guardados na sequência que você
        definir aqui.
      </p>
      {!canEdit && (
        <div className="editor-access-notice">
          <strong>Salvamento protegido</strong>
          <p>
            Entre com o acesso de edição do projeto. Você pode testar a capa e os textos antes de
            entrar.
          </p>
          <a href="/admin" target="_blank" rel="noreferrer">
            Abrir painel de edição
          </a>
          <button type="button" onClick={onCheckAccess}>
            Já entrei, atualizar acesso
          </button>
        </div>
      )}
      <div className="highlight-editor-grid grid grid-cols-[minmax(0,1fr)_220px] gap-7 max-[760px]:grid-cols-1">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (pending || !canEdit) return
            setPending(true)
            setError('')
            setFields({})
            try {
              const result = await saveStudioHighlight({
                ...(highlight ? { id: highlight.id, updatedAt: highlight.updatedAt } : {}),
                name,
                icon,
                color,
                category,
                sortOrder: order,
                status,
                stories,
              })
              if (!result.success) {
                setError(result.error)
                setFields(result.fields ?? {})
                return
              }
              onSaved(result.data)
            } catch {
              setError('A conexão falhou. Seu conteúdo continua aqui; tente novamente.')
            } finally {
              setPending(false)
            }
          }}
        >
          <fieldset disabled={pending} className="contents">
            <div className="editor-section-heading">
              <strong>Capa do destaque</strong>
              <button type="button" className="text-link" onClick={() => setPreview(-1)}>
                Ver capa
              </button>
            </div>
            <label>
              Nome no perfil
              <input
                aria-label="Nome do destaque"
                required
                maxLength={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Sobre"
              />
              {fieldError('name')}
            </label>
            <small className="highlight-input-hint">Até 15 caracteres.</small>
            <fieldset className="highlight-icon-picker">
              <legend>Ícone da capa</legend>
              <div>
                {highlightIcons.map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-label={iconNames[item]}
                    aria-pressed={icon === item}
                    className={icon === item ? 'active' : ''}
                    onClick={() => {
                      setIcon(item)
                      setPreview(-1)
                    }}
                  >
                    <HighlightSymbol name={item} emblem={brand.emblem} size={23} />
                  </button>
                ))}
              </div>
              {fieldError('icon')}
            </fieldset>
            <div className="editor-columns">
              <label>
                Cor da capa
                <select
                  aria-label="Cor da capa"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value as StudioHighlight['color'])
                    setPreview(-1)
                  }}
                >
                  {studioColors.map((item) => (
                    <option key={item} value={item}>
                      {colorNames[item]}
                    </option>
                  ))}
                </select>
                {fieldError('color')}
              </label>
              <label>
                Ordem no perfil
                <input
                  aria-label="Ordem no perfil"
                  type="number"
                  min={0}
                  max={999}
                  step={1}
                  required
                  value={order}
                  onChange={(e) => setOrder(e.target.valueAsNumber)}
                />
                {fieldError('sortOrder')}
              </label>
            </div>
            <label>
              Tema relacionado
              <select
                aria-label="Tema do destaque"
                value={category}
                onChange={(e) => setCategory(e.target.value as StudioHighlight['category'])}
              >
                {studioCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {fieldError('category')}
            </label>
            <div className="editor-section-heading">
              <strong>Stories · {stories.length}/20</strong>
              <span>1080 × 1920 px</span>
            </div>
            {stories.map((story, index) => (
              <fieldset
                className="editor-slide highlight-editor-story"
                key={index}
                onFocus={() => setPreview(index)}
              >
                <legend>Story {index + 1}</legend>
                <div className="story-reorder">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveStory(index, -1)}
                    aria-label={`Mover story ${index + 1} para cima`}
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    disabled={index === stories.length - 1}
                    onClick={() => moveStory(index, 1)}
                    aria-label={`Mover story ${index + 1} para baixo`}
                  >
                    Descer
                  </button>
                </div>
                <label>
                  Título
                  <input
                    aria-label={`Título do story ${index + 1}`}
                    required
                    maxLength={100}
                    value={story.title}
                    onChange={(e) => updateStory(index, { title: e.target.value })}
                  />
                  {fieldError(`stories.${index}.title`)}
                </label>
                <label>
                  Trecho em destaque
                  <input
                    aria-label={`Destaque do story ${index + 1}`}
                    maxLength={80}
                    value={story.accent}
                    onChange={(e) => updateStory(index, { accent: e.target.value })}
                  />
                  {fieldError(`stories.${index}.accent`)}
                </label>
                <label htmlFor={`highlight-story-body-${index}`}>Texto</label>
                <textarea
                  id={`highlight-story-body-${index}`}
                  aria-label={`Texto do story ${index + 1}`}
                  rows={4}
                  maxLength={450}
                  value={story.body}
                  onChange={(e) => updateStory(index, { body: e.target.value })}
                />
                {fieldError(`stories.${index}.body`)}
                <label>
                  Cor do story
                  <select
                    aria-label={`Cor do story ${index + 1}`}
                    value={story.color}
                    onChange={(e) =>
                      updateStory(index, { color: e.target.value as HighlightStory['color'] })
                    }
                  >
                    {studioColors.map((item) => (
                      <option key={item} value={item}>
                        {colorNames[item]}
                      </option>
                    ))}
                  </select>
                  {fieldError(`stories.${index}.color`)}
                </label>
                <button
                  className="editor-remove-slide"
                  type="button"
                  disabled={stories.length <= 1}
                  onClick={() => {
                    setStories((items) => items.filter((_, i) => i !== index))
                    setPreview(-1)
                  }}
                >
                  Remover story {index + 1}
                </button>
              </fieldset>
            ))}
            <button
              type="button"
              className="export-button"
              disabled={stories.length >= 20}
              onClick={() => {
                setStories((items) => [...items, { title: '', accent: '', body: '', color }])
                setPreview(stories.length)
              }}
            >
              <Icon name="plus" size={16} />
              Adicionar story
            </button>
            {fieldError('stories')}
            <label>
              Etapa
              <select
                aria-label="Etapa do destaque"
                value={status}
                onChange={(e) => setStatus(e.target.value as StudioHighlight['status'])}
              >
                <option value="draft">Rascunho — continuar depois</option>
                <option value="published">Pronto — mostrar na prévia</option>
              </select>
              {fieldError('status')}
            </label>
            <p className="editor-publish-note">
              Rascunhos ficam restritos aos editores. Marcar como pronto não publica no Instagram.
            </p>
            {error && (
              <div role="alert" className="editor-error">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="primary-button"
              disabled={pending || !canEdit || !name.trim()}
            >
              {pending ? 'Salvando…' : 'Salvar destaque no acervo'}
            </button>
          </fieldset>
        </form>
        <aside className="highlight-live-preview">
          <span className="eyebrow">
            {preview < 0 ? 'PRÉVIA DA CAPA' : `PRÉVIA DO STORY ${preview + 1}`}
          </span>
          <HighlightArt highlight={previewHighlight} story={preview} emblem={brand.emblem} />
          <div className="highlight-preview-circle">
            <span className={`highlight-cover ${color}`}>
              <HighlightSymbol name={icon} emblem={brand.emblem} size={24} />
            </span>
            <strong>{name || 'Novo destaque'}</strong>
          </div>
          <p>A área central da capa cabe no recorte circular do Instagram.</p>
        </aside>
      </div>
    </>
  )
}
