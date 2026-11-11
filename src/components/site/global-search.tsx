import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { publishedComponents, getCategoryLabel } from '../../data/components'
import { Icon, type IconName } from './icon'

const SearchContext = createContext<() => void>(() => {})
type Entry = { title: string; description: string; icon: IconName; page?: '/' | '/components' | '/templates' | '/privacy' | '/brands'; slug?: string; group: string; keywords?: string }
const entries: Entry[] = [
  { title: 'Home', description: 'An independent collection of thoughtful React components.', icon: 'home', page: '/', group: 'Pages' },
  { title: 'All components', description: 'Explore the collection. Preview, customize, and copy.', icon: 'panel', page: '/components', group: 'Pages' },
  { title: 'Templates', description: 'Astro website templates for portfolios, products, and personal projects.', icon: 'panel', page: '/templates', group: 'Pages' },
  { title: 'Brand assets', description: 'Download RicoUI logos and artwork as PNG files.', icon: 'download', page: '/brands', group: 'Pages', keywords: 'brands logo logos branding press kit' },
  ...publishedComponents.map(c => ({ title: c.name, description: c.description, icon: 'code' as const, slug: c.slug, group: 'Components', keywords: getCategoryLabel(c.category) })),
]

export function SearchTrigger({ compact = false }: { compact?: boolean }) {
  const open = useContext(SearchContext)
  return <button className={compact ? 'icon-button search-trigger compact' : 'search-trigger'} aria-label="Search components and pages" aria-haspopup="dialog" aria-keyshortcuts="Control+k Meta+k" onClick={open}><Icon name="search" />{!compact && <><span>Search components…</span><kbd>⌘ K</kbd></>}</button>
}

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const visible = entries.filter(e => (e.title + ' ' + e.description + ' ' + (e.keywords || '')).toLowerCase().includes(query.trim().toLowerCase()))
  const open = useCallback(() => {
    const node = dialog.current
    if (!node || node.open) return
    clearTimeout(timer.current)
    previousFocus.current = document.activeElement as HTMLElement
    setQuery(''); setActive(0)
    node.classList.remove('is-closing', 'is-open')
    node.showModal()
    void node.offsetWidth
    node.classList.add('is-open')
    input.current?.focus()
  }, [])
  function close(after?: () => void) {
    const node = dialog.current
    if (!node || !node.open || node.classList.contains('is-closing')) return
    node.classList.remove('is-open')
    node.classList.add('is-closing')
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : parseFloat(getComputedStyle(node).getPropertyValue('--modal-close-dur')) || 150
    timer.current = setTimeout(() => {
      node.close(); node.classList.remove('is-closing')
      previousFocus.current?.focus()
      after?.()
    }, duration)
  }
  function select(entry: Entry) {
    close(() => { if (entry.slug) void navigate({ to: '/components/$slug', params: { slug: entry.slug } }); else if (entry.page) void navigate({ to: entry.page }) })
  }
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open() }
    }
    document.addEventListener('keydown', shortcut)
    return () => { document.removeEventListener('keydown', shortcut); clearTimeout(timer.current) }
  }, [open])
  useEffect(() => { dialog.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [active, query])
  return <SearchContext.Provider value={open}>{children}
    <dialog ref={dialog} className="global-search t-modal" aria-label="Search components and pages" onCancel={e => { e.preventDefault(); close() }} onClick={e => { if (e.target === dialog.current) close() }} onKeyDown={e => e.stopPropagation()}>
      <div className="search-dialog-inner">
        <div className="search-input-row"><Icon name="search" size={21} /><input ref={input} role="combobox" aria-label="Search components and pages" aria-autocomplete="list" aria-expanded="true" aria-controls="global-search-results" aria-activedescendant={visible.length ? 'search-result-' + active : undefined} placeholder="Search components or pages…" value={query} onChange={e => { setQuery(e.target.value); setActive(0) }} onKeyDown={e => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setActive(i => visible.length ? (i + (e.key === 'ArrowDown' ? 1 : visible.length - 1)) % visible.length : 0) }
          if (e.key === 'Enter' && visible[active]) { e.preventDefault(); select(visible[active]) }
        }} /><button className="search-escape" onClick={() => close()} aria-label="Close search">Esc</button></div>
        <div id="global-search-results" role="listbox" aria-label="Search results" className="search-results">
          {visible.map((entry, index) => <div role="presentation" key={entry.slug || entry.page}>
            {(index === 0 || visible[index - 1].group !== entry.group) && <div className="search-group-label" role="presentation">{entry.group}</div>}
            <div id={'search-result-' + index} role="option" aria-selected={active === index} className="search-result" onMouseMove={() => setActive(index)} onMouseDown={e => e.preventDefault()} onClick={() => select(entry)}>
              <span className="search-result-icon"><Icon name={entry.icon} /></span><span className="search-result-copy"><strong>{entry.title}</strong><span>{entry.description}</span></span><Icon name="arrow" size={17} />
            </div>
          </div>)}
          {!visible.length && <p className="search-no-results">No results for “{query}”. Try a component name.</p>}
        </div>
        <footer className="search-dialog-footer"><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to open</span><span className="search-result-count" role="status">{visible.length} results</span></footer>
      </div>
    </dialog>
  </SearchContext.Provider>
}
