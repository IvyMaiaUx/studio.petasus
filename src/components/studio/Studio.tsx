'use client'

import Image from 'next/image'
import { Icon, type IconName } from './Icon'
import { useRouter } from 'next/navigation'
import { PostArt } from './PostArt'
import type { StudioPost as Post, StudioBrand, StudioHighlight } from '@/lib/studio-types'
import { getStudioSession, saveStudioProfile } from '@/app/(frontend)/actions'
import { PostEditor } from './PostEditor'
import { HighlightArt } from './HighlightArt'
import { HighlightEditor } from './HighlightEditor'
import { HighlightsPanel } from './HighlightsPanel'
import { HighlightSymbol } from './HighlightSymbol'
import { ProfileAvatar } from './ProfileAvatar'
import { useEffect, useRef, useState, type ReactNode } from 'react'
const categories = [
  'Todos',
  'Presença digital',
  'Posicionamento',
  'Sites & experiência',
  'Petasus por perto',
]
const palette = [
  { name: 'Azul Petasus', hex: '#243CB5', class: 'blue' },
  { name: 'Amarelo-manteiga', hex: '#FFEDAD', class: 'yellow' },
  { name: 'Marrom profundo', hex: '#38231F', class: 'brown' },
  { name: 'Off-white', hex: '#FAF9F5', class: 'cream' },
]
const themeDetails = [
  [
    '01',
    'Presença digital',
    'Como os clientes encontram sua empresa.',
    'Google, redes sociais e os caminhos que aproximam sua empresa de novos clientes.',
    '3 ideias de posts',
    'grid',
  ],
  [
    '02',
    'Posicionamento',
    'Como sua marca se apresenta.',
    'Clareza, identidade e consistência para transformar presença em reconhecimento.',
    '3 ideias de posts',
    'spark',
  ],
  [
    '03',
    'Sites & experiência',
    'O que precisa funcionar no seu site.',
    'Sites que unem estética, usabilidade e uma experiência que facilita a conversa.',
    '2 ideias de posts',
    'layers',
  ],
  [
    '04',
    'Petasus por perto',
    'O trabalho da Petasus.',
    'Nosso jeito de pensar, os bastidores e um convite para dar o próximo passo.',
    '1 ideia de post',
    'heart',
  ],
]

function Modal({
  children,
  onClose,
  className = '',
}: {
  children: ReactNode
  onClose: () => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key === 'Tab') {
        const elements = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, textarea, select, [tabindex="0"]',
        )
        if (!elements?.length) return
        const first = elements[0],
          last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', key)
      previous?.focus()
    }
  }, [])
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${className}`}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes da prévia"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button className="modal-close icon-button" aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
    </div>
  )
}

export default function Studio({
  initialPosts,
  initialBrand,
  initialHighlights,
}: {
  initialPosts: Post[]
  initialBrand: StudioBrand
  initialHighlights: StudioHighlight[]
}) {
  const router = useRouter()
  const [page, setPage] = useState('feed')
  const [posts, setPosts] = useState(initialPosts)
  const [filter, setFilter] = useState('Todos')
  const [view, setView] = useState('grid')
  const [selected, setSelected] = useState<Post | null>(null)
  const [slide, setSlide] = useState(0)
  const [newPost, setNewPost] = useState(false)
  const [toast, setToast] = useState('')
  const [exporting, setExporting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [savedIds, setSavedIds] = useState<Post['id'][]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [archiveFilter, setArchiveFilter] = useState('all')
  const [exportProgress, setExportProgress] = useState('')
  const [profilePending, setProfilePending] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [brand, setBrand] = useState(initialBrand)
  const [profileTab, setProfileTab] = useState('posts')
  const [highlights, setHighlights] = useState(initialHighlights)
  const [highlight, setHighlight] = useState<StudioHighlight | null>(null)
  const [highlightStory, setHighlightStory] = useState(0)
  const [highlightFilter, setHighlightFilter] = useState('all')
  const [newHighlight, setNewHighlight] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState<StudioHighlight | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState(initialBrand.name)
  const [profileBio, setProfileBio] = useState(initialBrand.bio)
  const [draftName, setDraftName] = useState(profileName)
  const [draftBio, setDraftBio] = useState(profileBio)
  const [draftStats, setDraftStats] = useState({
    instagramPosts: initialBrand.instagramPosts,
    followers: initialBrand.followers,
    following: initialBrand.following,
  })
  const filtered = posts.filter(
    (post) =>
      (filter === 'Todos' || post.category === filter) &&
      (archiveFilter === 'all' || post.status === archiveFilter) &&
      (profileTab !== 'saved' || savedIds.includes(post.id)) &&
      profileTab !== 'tagged',
  )
  const saved = selected !== null && savedIds.includes(selected.id)
  async function refreshAccess() {
    try {
      const result = await getStudioSession()
      setCanEdit(result.canEdit)
      setPosts(result.posts)
      setHighlights(result.highlights)
      setBrand(result.brand)
      setProfileName(result.brand.name)
      setProfileBio(result.brand.bio)
      if (!result.canEdit) setToast('Entre no painel de edição para acessar os rascunhos e salvar.')
    } catch {
      setToast('Não foi possível verificar o acesso. Tente novamente.')
    }
  }
  useEffect(() => {
    let active = true
    getStudioSession()
      .then((result) => {
        if (!active) return
        setCanEdit(result.canEdit)
        setPosts(result.posts)
        setHighlights(result.highlights)
        setBrand(result.brand)
        setProfileName(result.brand.name)
        setProfileBio(result.brand.bio)
      })
      .catch(() => {
        if (active)
          setToast('O acervo está visível, mas não foi possível verificar seu acesso de edição.')
      })
    return () => {
      active = false
    }
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(timer)
  }, [toast])
  const openPost = (post: Post) => {
    setSelected(post)
    setSlide(0)
    setLiked(false)
  }
  function openHighlight(item: StudioHighlight, story = 0) {
    setHighlight(item)
    setHighlightStory(story)
  }
  function editHighlight(item: StudioHighlight) {
    setEditingHighlight(item)
    setHighlight(null)
    setNewHighlight(true)
  }
  async function exportHighlights(
    item?: StudioHighlight,
    mode: 'cover' | 'story' | 'zip' | 'covers' = 'zip',
  ) {
    if (exporting) return
    setExporting(true)
    setExportProgress('Preparando destaques…')
    try {
      const exporter = await import('@/lib/studio-export')
      if (item && (mode === 'cover' || mode === 'story'))
        await exporter.downloadHighlightPng(item, mode === 'cover' ? -1 : highlightStory, brand)
      else
        await exporter.downloadHighlightsZip(
          item ? [item] : highlights,
          brand,
          setExportProgress,
          mode === 'covers',
        )
      setToast(
        mode === 'cover' || mode === 'story'
          ? 'PNG em 1080 × 1920 px pronto para baixar.'
          : 'ZIP dos destaques pronto para baixar.',
      )
    } catch {
      setToast('Não foi possível gerar o arquivo. Tente novamente; o destaque continua salvo.')
    } finally {
      setExporting(false)
      setExportProgress('')
    }
  }
  async function exportPosts(only?: Post, singleSlide = false) {
    if (exporting) return
    setExporting(true)
    setExportProgress('Preparando artes…')
    try {
      const exporter = await import('@/lib/studio-export')
      if (only && singleSlide) await exporter.downloadPostPng(only, slide, brand)
      else await exporter.downloadPostsZip(only ? [only] : filtered, brand, setExportProgress)
      setToast(
        singleSlide
          ? 'PNG em 1080 × 1350 px pronto para baixar.'
          : 'ZIP com artes e legendas pronto para baixar.',
      )
    } catch {
      setToast(
        'Não foi possível gerar o arquivo. Confira sua conexão e tente novamente; o post continua salvo.',
      )
    } finally {
      setExporting(false)
      setExportProgress('')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="wordmark"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setPage('feed')
          }}
        >
          petasus<span>®</span>
        </a>
        <div className="workspace-label">SEU ESTÚDIO DE CONTEÚDO</div>
        <button
          className="workspace-switch"
          onClick={() => setToast('Você está no espaço de criação da Petasus.')}
        >
          <ProfileAvatar image={brand.avatar} className="workspace-avatar" />
          <span>
            Petasus Digital<small>Espaço da marca</small>
          </span>
          <Icon name="down" size={15} />
        </button>
        <div className="nav-label">PLANEJAMENTO</div>
        <nav>
          {(
            [
              ['feed', 'grid', 'Prévia do feed'],
              ['highlights', 'layers', 'Destaques'],
              ['themes', 'spark', 'Temas & ideias'],
              ['identity', 'palette', 'Identidade visual'],
            ] as const
          ).map(([key, icon, label]) => (
            <button
              key={key}
              className={`nav-item ${page === key ? 'active' : ''}`}
              onClick={() => setPage(key)}
            >
              <Icon name={icon} size={19} />
              <span>{label}</span>
              {key === 'themes' && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <Icon name="instagram" size={23} />
          <h3>O Instagram da Petasus</h3>
          <p>Posts, destaques e identidade visual no mesmo lugar.</p>
          <span className="note-line" />
        </div>
        <div className="sidebar-bottom">
          <span className="user-avatar">P</span>
          <div>
            Petasus Digital<small>Planejamento de conteúdo</small>
          </div>
          <span className="online-dot" />
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <span className="mobile-brand-mark">petasus®</span>
            <span className="topbar-crumbs">
              <span>Espaço da marca</span>
              <span className="breadcrumb">/</span>
              <strong>
                {page === 'feed'
                  ? 'Prévia do feed'
                  : page === 'highlights'
                    ? 'Destaques'
                    : page === 'themes'
                      ? 'Temas & ideias'
                      : 'Identidade visual'}
              </strong>
            </span>
          </div>
          <div className="topbar-right">
            <span className="draft-dot" />
            <span>{canEdit ? 'Edição conectada' : 'Acervo'}</span>
            <span className="top-avatar">P</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">PETASUS DIGITAL</div>
              <h1>
                {page === 'feed'
                  ? 'Prévia do Instagram'
                  : page === 'highlights'
                    ? 'Os destaques da Petasus'
                    : page === 'themes'
                      ? 'O que vamos postar?'
                      : 'Identidade visual'}
              </h1>
              <p>
                {page === 'feed'
                  ? 'Veja como os posts ficam juntos no perfil.'
                  : page === 'highlights'
                    ? 'Capas e sequências de stories para organizar o perfil.'
                    : page === 'themes'
                      ? 'Sugestões de assuntos para as próximas publicações da Petasus.'
                      : 'As cores, fontes e detalhes usados nos posts.'}
              </p>
            </div>
            <div className="page-heading-actions">
              {page === 'highlights' && (
                <button
                  className="export-button"
                  disabled={exporting || !highlights.length}
                  onClick={() => exportHighlights(undefined, 'covers')}
                >
                  <Icon name="download" size={16} />
                  Baixar capas
                </button>
              )}
              <button
                className="primary-button"
                onClick={() => {
                  if (page === 'highlights') {
                    setEditingHighlight(null)
                    setNewHighlight(true)
                  } else {
                    setEditingPost(null)
                    setNewPost(true)
                  }
                }}
              >
                <Icon name="plus" size={18} />
                {page === 'highlights' ? 'Novo destaque' : 'Novo post'}
              </button>
            </div>
          </div>
          <div className="page-tabs">
            <div>
              <button className={page === 'feed' ? 'selected' : ''} onClick={() => setPage('feed')}>
                <Icon name="instagram" size={17} />
                Prévia do feed
              </button>
              <button
                className={page === 'highlights' ? 'selected' : ''}
                onClick={() => setPage('highlights')}
              >
                <Icon name="layers" size={17} />
                Destaques
              </button>
              <button
                className={page === 'themes' ? 'selected' : ''}
                onClick={() => setPage('themes')}
              >
                <Icon name="spark" size={17} />
                Temas & ideias<span>4</span>
              </button>
              <button
                className={page === 'identity' ? 'selected' : ''}
                onClick={() => setPage('identity')}
              >
                <Icon name="palette" size={17} />
                Identidade visual
              </button>
            </div>
            <span className="proposal-badge">
              <span />
              Salvo na nuvem
            </span>
          </div>

          {page === 'feed' && (
            <div className="content-layout">
              <section className="feed-section">
                <div className="studio-storage-bar">
                  <span>
                    <Icon name="check" size={14} />
                    Posts, legendas e destaques guardados no acervo
                  </span>
                </div>
                <div className="archive-filters" aria-label="Etapa dos posts">
                  {(
                    [
                      ['all', 'Todos'],
                      ['draft', 'Rascunhos'],
                      ['published', 'Prontos'],
                    ] as const
                  ).map(([key, name]) => (
                    <button
                      key={key}
                      className={archiveFilter === key ? 'active' : ''}
                      onClick={() => setArchiveFilter(key)}
                    >
                      {name}
                      <span>
                        {posts.filter((post) => key === 'all' || post.status === key).length}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="feed-toolbar">
                  <div className="feed-label">
                    <Icon name="instagram" size={17} />
                    <strong>Visualização do perfil</strong>
                    <span>Prévia</span>
                  </div>
                  <div className="view-switch">
                    <button
                      className={view === 'grid' ? 'active' : ''}
                      aria-label="Visualização do Instagram"
                      onClick={() => setView('grid')}
                    >
                      <Icon name="grid" size={16} />
                    </button>
                    <button
                      className={view === 'list' ? 'active' : ''}
                      aria-label="Mostrar detalhes dos posts"
                      onClick={() => setView('list')}
                    >
                      <Icon name="list" size={17} />
                    </button>
                  </div>
                </div>
                <div className="filters" aria-label="Filtrar por tema">
                  {categories.map((item) => (
                    <button
                      className={filter === item ? 'active' : ''}
                      key={item}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className={`instagram-preview ${view === 'list' ? 'show-post-details' : ''}`}>
                  <div className="insta-mobile-header">
                    <span>petasus.digital</span>
                    <Icon name="down" size={17} />
                    <Icon name="instagram" size={21} />
                  </div>
                  <div className="instagram-profile">
                    <ProfileAvatar image={brand.avatar} className="profile-avatar" large />
                    <div className="profile-info">
                      <div className="profile-name">
                        <span>petasus.digital</span>
                        <div className="profile-actions">
                          <button
                            onClick={() => {
                              setDraftName(profileName)
                              setDraftBio(profileBio)
                              setDraftStats({
                                instagramPosts: brand.instagramPosts,
                                followers: brand.followers,
                                following: brand.following,
                              })
                              setEditingProfile(true)
                            }}
                          >
                            Editar perfil
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(window.location.href)
                                setToast('Link desta prévia copiado.')
                              } catch {
                                setToast('Não foi possível copiar o link desta prévia.')
                              }
                            }}
                          >
                            Compartilhar perfil
                          </button>
                        </div>
                      </div>
                      <div className="profile-stats">
                        <span>
                          <strong>{brand.instagramPosts}</strong> posts
                        </span>
                        <span>
                          <strong>{brand.followers}</strong> seguidores
                        </span>
                        <span>
                          <strong>{brand.following}</strong> seguindo
                        </span>
                      </div>
                      <div className="profile-bio">
                        <strong>{profileName}</strong>
                        <p>{profileBio}</p>
                      </div>
                    </div>
                  </div>
                  <div className="profile-highlights">
                    {highlights.map((item) => (
                      <button
                        key={item.id}
                        className="highlight-button"
                        onClick={() => openHighlight(item)}
                      >
                        <span className="highlight-ring">
                          <span className={`highlight-cover ${item.color}`}>
                            <HighlightSymbol name={item.icon} emblem={brand.emblem} size={23} />
                          </span>
                        </span>
                        <span>{item.name}</span>
                        {item.status === 'draft' && (
                          <small className="highlight-draft-mini">Rascunho</small>
                        )}
                      </button>
                    ))}
                    <button
                      className="highlight-button highlight-add"
                      onClick={() => {
                        setEditingHighlight(null)
                        setNewHighlight(true)
                      }}
                      aria-label="Novo destaque"
                    >
                      <span className="highlight-ring">
                        <span className="highlight-cover">
                          <Icon name="plus" size={24} />
                        </span>
                      </span>
                      <span>Novo</span>
                    </button>
                  </div>
                  <div className="profile-manage-highlights">
                    <button onClick={() => setPage('highlights')}>
                      Gerenciar destaques
                      <Icon name="arrow" size={13} />
                    </button>
                  </div>
                  <div
                    className="profile-grid-tabs"
                    role="tablist"
                    aria-label="Publicações do perfil"
                  >
                    {(
                      [
                        ['posts', 'grid', 'Publicações'],
                        ['saved', 'bookmark', 'Salvos'],
                        ['tagged', 'tag', 'Marcados'],
                      ] as const
                    ).map(([key, icon, label]) => (
                      <button
                        key={key}
                        role="tab"
                        aria-selected={profileTab === key}
                        className={profileTab === key ? 'active' : ''}
                        onClick={() => setProfileTab(key)}
                      >
                        <Icon name={icon} size={15} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="posts-grid">
                    {filtered.map((post) => (
                      <button
                        className="post-card"
                        key={post.id}
                        onClick={() => openPost(post)}
                        aria-label={`Abrir post: ${post.title} ${post.accent}`}
                      >
                        <div className="post-art-wrap">
                          <PostArt post={post} emblem={brand.emblem} />
                          {post.status === 'draft' && (
                            <span className="post-draft-label">Rascunho</span>
                          )}
                          <span className="post-type">
                            {post.format === 'Carrossel' ? <Icon name="layers" size={14} /> : null}
                          </span>
                          <span className="post-hover">
                            Ver post <Icon name="arrow" size={16} />
                          </span>
                        </div>
                        <div className="post-meta">
                          <span>
                            <i
                              className={`category-dot ${
                                post.category === 'Posicionamento'
                                  ? 'purple'
                                  : post.category === 'Sites & experiência'
                                    ? 'orange'
                                    : post.category === 'Petasus por perto'
                                      ? 'pink'
                                      : ''
                              }`}
                            />
                            {post.category}
                          </span>
                          <small>{post.format}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                  {filtered.length === 0 && (
                    <div className="profile-empty">
                      <span>
                        <Icon name={profileTab === 'tagged' ? 'tag' : 'bookmark'} size={28} />
                      </span>
                      <h3>
                        {profileTab === 'tagged'
                          ? 'Nenhuma publicação marcada'
                          : 'Nenhum post por aqui ainda'}
                      </h3>
                      <p>
                        {profileTab === 'tagged'
                          ? 'Esta prévia não inclui publicações de outros perfis.'
                          : profileTab === 'saved'
                            ? 'Abra um post e toque no ícone de salvar para encontrá-lo aqui.'
                            : 'Escolha outro tema para ver os posts.'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="feed-footnote">
                  <Icon name="instagram" size={14} />
                  <span>
                    Dados do Instagram informados por você · a grade mostra os posts planejados.
                  </span>
                  <span>Posts em 4:5</span>
                </div>
              </section>
              <aside className="details-sidebar">
                <section className="side-section">
                  <div className="section-label">
                    <h3>A paleta da marca</h3>
                    <button aria-label="Ver identidade visual" onClick={() => setPage('identity')}>
                      <Icon name="arrow" size={17} />
                    </button>
                  </div>
                  <div className="palette-strip">
                    {palette.map((item) => (
                      <button
                        style={{ background: item.hex }}
                        key={item.hex}
                        title={`${item.name}: ${item.hex}`}
                        aria-label={`Copiar ${item.hex}`}
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(item.hex)
                            .then(() => setToast(`${item.hex} copiado.`))
                            .catch(() => setToast(`${item.name}: ${item.hex}`))
                        }}
                      />
                    ))}
                  </div>
                  <div className="palette-label">
                    <span>Clique em uma cor para copiar o código.</span>
                  </div>
                </section>
                <section className="side-section pillars">
                  <div className="section-label">
                    <h3>Temas dos posts</h3>
                    <span>4 temas</span>
                  </div>
                  {themeDetails.map(([number, theme]) => (
                    <button
                      key={number}
                      onClick={() => {
                        setFilter(theme)
                        setProfileTab('posts')
                      }}
                    >
                      <span className={`pillar-icon p${number}`}>{number}</span>
                      <span>{theme}</span>
                      <Icon name="chevron" size={14} />
                    </button>
                  ))}
                  <button className="text-link" onClick={() => setPage('themes')}>
                    Explorar temas & ideias
                    <Icon name="arrow" size={16} />
                  </button>
                </section>
                <div className="brand-note">
                  <span>
                    <Icon name="check" size={15} />
                  </span>
                  <p>
                    O pégaso fica só no rodapé.
                    <small>Como você pediu, sem os cavalos grandes.</small>
                  </p>
                </div>
                <button
                  className="export-button"
                  disabled={exporting || filtered.length === 0}
                  onClick={() => exportPosts()}
                >
                  <Icon name="download" size={17} />
                  {exporting ? 'Gerando arquivos…' : 'Baixar posts do feed'}
                  <span>ZIP</span>
                </button>
                <p className="preview-disclaimer">
                  Esta prévia não está conectada
                  <br />
                  com a sua conta do Instagram.
                </p>
              </aside>
            </div>
          )}

          {page === 'highlights' && (
            <>
              <div className="archive-filters" aria-label="Etapa dos destaques">
                {(
                  [
                    ['all', 'Todos'],
                    ['draft', 'Rascunhos'],
                    ['published', 'Prontos'],
                  ] as const
                ).map(([key, name]) => (
                  <button
                    key={key}
                    className={highlightFilter === key ? 'active' : ''}
                    onClick={() => setHighlightFilter(key)}
                  >
                    {name}
                    <span>
                      {highlights.filter((item) => key === 'all' || item.status === key).length}
                    </span>
                  </button>
                ))}
              </div>
              <HighlightsPanel
                emblem={brand.emblem}
                highlights={highlights.filter(
                  (item) => highlightFilter === 'all' || item.status === highlightFilter,
                )}
                onOpen={openHighlight}
                onEdit={editHighlight}
                onExport={(item, cover) => exportHighlights(item, cover ? 'cover' : 'zip')}
                exporting={exporting}
              />
            </>
          )}
          {page === 'themes' && (
            <section className="themes-page">
              <div className="themes-intro">
                <span className="eyebrow">ASSUNTOS PARA O PERFIL</span>
                <h2>Sugestões para os próximos posts</h2>
                <p>
                  Separei as ideias por assunto. Clique em uma delas para ver o post e a legenda.
                </p>
              </div>
              <div className="theme-grid">
                {themeDetails.map(([number, name, headline, description, count, icon]) => (
                  <article className="theme-card" key={number}>
                    <div className="theme-card-top">
                      <span>{number} / PILAR</span>
                      <Icon name={icon as IconName} />
                    </div>
                    <span className="theme-name">{name}</span>
                    <h3>{headline}</h3>
                    <p>{description}</p>
                    <div className="theme-ideas">
                      {posts
                        .filter((p) => p.category === name)
                        .map((post) => (
                          <button key={post.id} onClick={() => openPost(post)}>
                            {post.title} {post.accent}
                            <Icon name="arrow" size={16} />
                          </button>
                        ))}
                    </div>
                    <button
                      className="text-link"
                      onClick={() => {
                        setFilter(name)
                        setProfileTab('posts')
                        setPage('feed')
                      }}
                    >
                      {posts.filter((post) => post.category === name).length} posts
                      <Icon name="arrow" size={16} />
                    </button>
                  </article>
                ))}
              </div>
              <div className="editorial-note">
                <Icon name="spark" />
                <p>
                  <strong>Uma sugestão de ritmo:</strong> alterne conteúdos educativos, reflexões de
                  marca e convites para conversar. Comece com 3 publicações por semana e ajuste ao
                  seu ritmo.
                </p>
              </div>
            </section>
          )}

          {page === 'identity' && (
            <section className="identity-page">
              <div className="identity-hero">
                <span className="eyebrow">O NOSSO JEITO DE SER</span>
                <h2>
                  Estratégia com direção.
                  <br />
                  Design com <em>alma.</em>
                </h2>
                <p>A elegância do editorial encontra a clareza do digital.</p>
                <span className="identity-wordmark">Petasus®</span>
              </div>
              <div className="identity-columns">
                <article className="identity-card">
                  <h3>Cores que contam uma história</h3>
                  <p>Contrastes marcantes, com espaço para respirar.</p>
                  <div className="color-details">
                    {palette.map((item) => (
                      <div key={item.hex}>
                        <span style={{ background: item.hex }} />
                        <strong>{item.name}</strong>
                        <code>{item.hex}</code>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="identity-card">
                  <h3>Uma voz visual própria</h3>
                  <div className="font-sample">
                    Aa <em>& Bb</em>
                  </div>
                  <strong className="font-name">DM Serif Display + DM Sans</strong>
                  <p>Títulos expressivos e editoriais. Textos diretos, legíveis e humanos.</p>
                  <div className="logo-rule">
                    {brand.emblem && (
                      <Image
                        src={brand.emblem.url}
                        alt={brand.emblem.alt}
                        width={brand.emblem.width}
                        height={brand.emblem.height}
                      />
                    )}
                    <p>
                      <strong>Uma assinatura, não um protagonista.</strong>
                      <br />
                      Pégaso pequeno e apenas no rodapé dos posts.
                    </p>
                  </div>
                </article>
              </div>
            </section>
          )}
          <footer className="page-footer">
            <span>Petasus Studio</span>
            <span>Planejamento do Instagram · Petasus Digital</span>
            <span>PRÉVIA EDITORIAL · 01</span>
          </footer>
        </main>
      </div>
      {selected && (
        <Modal onClose={() => setSelected(null)} className="post-modal">
          <div className="modal-art">
            <PostArt post={selected} slide={slide} emblem={brand.emblem} />
            {selected.format === 'Carrossel' && (
              <div className="carousel-controls">
                <button
                  disabled={slide === 0}
                  onClick={() => setSlide((s) => s - 1)}
                  aria-label="Slide anterior"
                >
                  <span className="rotate-icon">
                    <Icon name="chevron" size={17} />
                  </span>
                </button>
                <span>
                  {slide + 1} / {selected.slides.length}
                </span>
                <button
                  disabled={slide >= selected.slides.length - 1}
                  onClick={() => setSlide((s) => s + 1)}
                  aria-label="Próximo slide"
                >
                  <Icon name="chevron" size={17} />
                </button>
              </div>
            )}
          </div>
          <div className="modal-info">
            <div className="modal-account">
              <ProfileAvatar image={brand.avatar} className="workspace-avatar" />
              <strong>petasus.digital</strong>
              <span>{selected.status === 'draft' ? 'Rascunho' : 'Pronto'}</span>
            </div>
            <span className="modal-category">
              {selected.category} · {selected.format}
            </span>
            <h2>
              {selected.title} <em>{selected.accent}</em>
            </h2>
            <div className="engagement">
              <button
                aria-label={liked ? 'Descurtir' : 'Curtir'}
                aria-pressed={liked}
                onClick={() => setLiked(!liked)}
                className={liked ? 'engaged' : ''}
              >
                <Icon name="heart" />
              </button>
              <button
                aria-label={saved ? 'Remover dos salvos' : 'Salvar post'}
                aria-pressed={saved}
                onClick={() =>
                  setSavedIds((ids) =>
                    saved ? ids.filter((id) => id !== selected.id) : [...ids, selected.id],
                  )
                }
                className={saved ? 'engaged' : ''}
              >
                <Icon name="bookmark" />
              </button>
            </div>
            <div className="caption-heading">
              <h3>LEGENDA DO INSTAGRAM</h3>
              <button
                disabled={!selected.caption}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(selected.caption)
                    setToast('Legenda copiada.')
                  } catch {
                    setToast('Não foi possível copiar. Selecione a legenda e copie manualmente.')
                  }
                }}
              >
                Copiar legenda
              </button>
            </div>
            <p className="caption">{selected.caption}</p>
            <button
              className="export-button"
              disabled={exporting}
              onClick={() => exportPosts(selected, true)}
            >
              <Icon name="download" size={17} />
              {selected.format === 'Carrossel' ? `Baixar slide ${slide + 1} em PNG` : 'Baixar PNG'}
            </button>
            {selected.format === 'Carrossel' && (
              <button
                className="export-button mt-2"
                disabled={exporting}
                onClick={() => exportPosts(selected)}
              >
                <Icon name="layers" size={17} />
                Baixar carrossel completo (.zip)
              </button>
            )}
            <button
              className="export-button mt-2"
              onClick={() => {
                setEditingPost(selected)
                setSelected(null)
                setNewPost(true)
              }}
            >
              Editar arte e legenda
            </button>
            <small className="modal-disclaimer">
              PNG em 1080 × 1350 px. A publicação no Instagram é manual.
            </small>
          </div>
        </Modal>
      )}
      {highlight && (
        <Modal onClose={() => setHighlight(null)} className="highlight-detail-modal">
          <div className="highlight-detail-art">
            <HighlightArt highlight={highlight} story={highlightStory} emblem={brand.emblem} />
            <div className="carousel-controls">
              <button
                disabled={highlightStory <= 0}
                onClick={() => setHighlightStory((index) => index - 1)}
                aria-label="Story anterior"
              >
                <span className="rotate-icon">
                  <Icon name="chevron" size={17} />
                </span>
              </button>
              <span>
                {highlightStory < 0
                  ? 'Capa'
                  : `${highlightStory + 1} / ${highlight.stories.length}`}
              </span>
              <button
                disabled={highlightStory >= highlight.stories.length - 1}
                onClick={() => setHighlightStory((index) => index + 1)}
                aria-label="Próximo story"
              >
                <Icon name="chevron" size={17} />
              </button>
            </div>
          </div>
          <div className="modal-info highlight-detail-info">
            <div className="modal-account">
              <ProfileAvatar image={brand.avatar} className="workspace-avatar" />
              <strong>petasus.digital</strong>
              <span>{highlight.status === 'draft' ? 'Rascunho' : 'Pronto'}</span>
            </div>
            <span className="eyebrow">DESTAQUE · {highlight.category.toUpperCase()}</span>
            <h2>{highlight.name}</h2>
            <p className="highlight-detail-description">
              {highlight.stories.length} stories e uma capa. As artes são baixadas sem botões ou
              molduras da prévia.
            </p>
            <div className="highlight-story-selector">
              <button
                className={highlightStory < 0 ? 'active' : ''}
                onClick={() => setHighlightStory(-1)}
              >
                Capa
              </button>
              {highlight.stories.map((_, i) => (
                <button
                  key={i}
                  className={highlightStory === i ? 'active' : ''}
                  onClick={() => setHighlightStory(i)}
                >
                  Story {i + 1}
                </button>
              ))}
            </div>
            <button
              className="export-button"
              disabled={exporting}
              onClick={() => exportHighlights(highlight, 'cover')}
            >
              <Icon name="download" size={17} />
              Baixar capa PNG
            </button>
            {highlightStory >= 0 && (
              <button
                className="export-button mt-2"
                disabled={exporting}
                onClick={() => exportHighlights(highlight, 'story')}
              >
                <Icon name="download" size={17} />
                Baixar story {highlightStory + 1} em PNG
              </button>
            )}
            <button
              className="export-button mt-2"
              disabled={exporting}
              onClick={() => exportHighlights(highlight, 'zip')}
            >
              <Icon name="layers" size={17} />
              Baixar destaque completo (.zip)
            </button>
            <button className="export-button mt-2" onClick={() => editHighlight(highlight)}>
              Editar capa e stories
            </button>
            {highlightStory >= 0 && (
              <button
                className="text-link highlight-copy-text"
                onClick={async () => {
                  const story = highlight.stories[highlightStory]
                  if (!story) return
                  try {
                    await navigator.clipboard.writeText(
                      `${story.title} ${story.accent}\n\n${story.body}`,
                    )
                    setToast('Texto do story copiado.')
                  } catch {
                    setToast('Não foi possível copiar. Tente novamente.')
                  }
                }}
              >
                Copiar texto deste story
              </button>
            )}
            <button
              className="text-link highlight-related-posts"
              onClick={() => {
                setFilter(highlight.category)
                setArchiveFilter('all')
                setProfileTab('posts')
                setHighlight(null)
                setPage('feed')
              }}
            >
              Ver posts sobre o assunto
              <Icon name="arrow" size={16} />
            </button>
            <small className="modal-disclaimer">
              Capas e stories em 1080 × 1920 px. A publicação no Instagram é manual.
            </small>
          </div>
        </Modal>
      )}
      {newHighlight && (
        <Modal
          onClose={() => setNewHighlight(false)}
          className="new-post-modal post-editor-modal highlight-editor-modal"
        >
          <HighlightEditor
            highlight={editingHighlight}
            brand={brand}
            canEdit={canEdit}
            onCheckAccess={refreshAccess}
            onSaved={(item) => {
              setHighlights((items) => {
                const next = items.some((existing) => existing.id === item.id)
                  ? items.map((existing) => (existing.id === item.id ? item : existing))
                  : [...items, item]
                return next.sort((a, b) => a.sortOrder - b.sortOrder)
              })
              setNewHighlight(false)
              setHighlightFilter('all')
              setPage('highlights')
              setToast(
                item.status === 'draft'
                  ? 'Destaque salvo como rascunho.'
                  : 'Destaque pronto e salvo no acervo.',
              )
              router.refresh()
            }}
          />
        </Modal>
      )}
      {editingProfile && (
        <Modal
          onClose={() => setEditingProfile(false)}
          className="new-post-modal edit-profile-modal"
        >
          <span className="eyebrow">PRÉVIA DO PERFIL</span>
          <h2>Editar perfil</h2>
          <p>
            Dados do perfil real, informados manualmente. Editar aqui não muda o Instagram nem
            publica os posts do acervo.
          </p>
          {!canEdit && (
            <div className="editor-access-notice">
              <p>Para salvar, entre com seu acesso de edição do projeto.</p>
              <a href="/admin" target="_blank" rel="noreferrer">
                Abrir painel de edição
              </a>
              <button onClick={refreshAccess}>Já entrei, atualizar acesso</button>
            </div>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!canEdit || profilePending) return
              setProfilePending(true)
              setProfileError('')
              try {
                const result = await saveStudioProfile({
                  name: draftName,
                  bio: draftBio,
                  ...draftStats,
                })
                if (!result.success) {
                  setProfileError([result.error, ...Object.values(result.fields ?? {})].join(' '))
                  return
                }
                setBrand(result.data)
                setProfileName(result.data.name)
                setProfileBio(result.data.bio)
                setEditingProfile(false)
                setToast('Dados do perfil salvos no acervo.')
                router.refresh()
              } catch {
                setProfileError('A conexão falhou. Tente salvar novamente.')
              } finally {
                setProfilePending(false)
              }
            }}
          >
            <label>
              Nome
              <input
                required
                maxLength={64}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </label>
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              required
              maxLength={150}
              rows={4}
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
            />
            <span className="bio-counter">{draftBio.length}/150</span>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ['instagramPosts', 'Posts'],
                  ['followers', 'Seguidores'],
                  ['following', 'Seguindo'],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    aria-label={`${label} no Instagram`}
                    type="number"
                    required
                    min={0}
                    max={Number.MAX_SAFE_INTEGER}
                    step={1}
                    value={Number.isNaN(draftStats[key]) ? '' : draftStats[key]}
                    onChange={(event) =>
                      setDraftStats((stats) => ({ ...stats, [key]: event.target.valueAsNumber }))
                    }
                  />
                </label>
              ))}
            </div>
            <p className="editor-publish-note">
              Esses números são do Instagram real. Criar posts no acervo não altera os contadores.
            </p>
            <button
              type="submit"
              className="primary-button"
              disabled={profilePending || !canEdit || !draftName.trim() || !draftBio.trim()}
            >
              {profilePending ? 'Salvando…' : 'Salvar perfil'}
            </button>
            {profileError && (
              <div className="editor-error" role="alert">
                {profileError}
              </div>
            )}
          </form>
        </Modal>
      )}
      {newPost && (
        <Modal onClose={() => setNewPost(false)} className="new-post-modal post-editor-modal">
          <PostEditor
            post={editingPost}
            canEdit={canEdit}
            onCheckAccess={refreshAccess}
            onSaved={(savedPost) => {
              setPosts((items) => {
                const exists = items.some((item) => item.id === savedPost.id)
                return exists
                  ? items.map((item) => (item.id === savedPost.id ? savedPost : item))
                  : [savedPost, ...items]
              })
              setSelected(null)
              setNewPost(false)
              setFilter('Todos')
              setArchiveFilter('all')
              setProfileTab('posts')
              setPage('feed')
              setToast(
                savedPost.status === 'draft'
                  ? 'Rascunho salvo no acervo.'
                  : 'Post pronto e salvo no acervo.',
              )
              router.refresh()
            }}
          />
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
      {exporting && (
        <div className="export-progress" role="status">
          <Icon name="download" size={18} />
          <span>{exportProgress}</span>
          <small>Mantenha esta página aberta.</small>
        </div>
      )}
    </div>
  )
}
