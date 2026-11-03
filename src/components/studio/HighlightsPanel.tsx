import { Icon } from './Icon'
import type { StudioHighlight, StudioBrand } from '@/lib/studio-types'
import { HighlightSymbol } from './HighlightSymbol'

export function HighlightsPanel({
  highlights,
  onOpen,
  onEdit,
  onExport,
  exporting,
  emblem,
}: {
  highlights: StudioHighlight[]
  onOpen: (highlight: StudioHighlight, story?: number) => void
  onEdit: (highlight: StudioHighlight) => void
  onExport: (highlight: StudioHighlight, cover: boolean) => void
  exporting: boolean
  emblem: StudioBrand['emblem']
}) {
  return (
    <section className="highlights-panel">
      <div className="highlights-panel-note">
        <Icon name="instagram" size={20} />
        <p>
          <strong>Capas e stories, juntos no acervo.</strong>
          <span>
            Baixe a capa ou o pacote completo. Depois, publique os stories no Instagram e adicione
            ao destaque.
          </span>
        </p>
      </div>
      {!highlights.length && (
        <div className="profile-empty">
          <h3>Vamos criar o primeiro destaque?</h3>
          <p>Use “Novo destaque” para escolher a capa e escrever os stories.</p>
        </div>
      )}
      <div className="highlights-card-grid grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
        {highlights.map((highlight) => (
          <article
            className="highlight-card rounded-lg border border-[#e5e1d6] bg-[#fffefa] p-6"
            key={highlight.id}
          >
            <div className="highlight-card-heading">
              <span>{String(highlight.sortOrder).padStart(2, '0')} / DESTAQUE</span>
              <span className={`highlight-status ${highlight.status}`}>
                {highlight.status === 'draft' ? 'Rascunho' : 'Pronto'}
              </span>
            </div>
            <button
              className="highlight-card-preview"
              onClick={() => onOpen(highlight)}
              aria-label={`Abrir destaque ${highlight.name}`}
            >
              <span className="highlight-ring">
                <span className={`highlight-cover ${highlight.color}`}>
                  <HighlightSymbol name={highlight.icon} emblem={emblem} size={38} />
                </span>
              </span>
              <h2>{highlight.name}</h2>
              <span>
                {highlight.stories.length} {highlight.stories.length === 1 ? 'story' : 'stories'} ·{' '}
                {highlight.category}
              </span>
            </button>
            <div className="highlight-card-stories">
              {highlight.stories.slice(0, 3).map((story, i) => (
                <button key={i} onClick={() => onOpen(highlight, i)}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {story.title}
                  <Icon name="chevron" size={14} />
                </button>
              ))}
              {highlight.stories.length > 3 && (
                <small>Mais {highlight.stories.length - 3} stories no destaque.</small>
              )}
            </div>
            <div className="highlight-card-actions">
              <button onClick={() => onEdit(highlight)}>
                Editar destaque
                <Icon name="arrow" size={15} />
              </button>
              <button disabled={exporting} onClick={() => onExport(highlight, true)}>
                <Icon name="download" size={15} />
                Capa PNG
              </button>
              <button disabled={exporting} onClick={() => onExport(highlight, false)}>
                <Icon name="layers" size={15} />
                Tudo em ZIP
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
