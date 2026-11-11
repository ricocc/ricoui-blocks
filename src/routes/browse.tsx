import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LayoutGrid, Pause, Play, Rows3 } from 'lucide-react'
import { BrowseCanvas } from '../components/site/browse-canvas'
import { BrowseCard } from '../components/site/browse-card'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { publishedComponents } from '../data/components'
import { pageHead } from '../lib/site'
import { AsciiBackground } from '../../registry/ascii-background'
import { useSiteTheme } from '../components/site/theme-toggle'
import { useMediaPlayback } from '../components/site/use-media-playback'

// Change to 'dots' to restore the original background. Its CSS stays intact.
const browseBackground: 'ascii' | 'dots' = 'ascii'

export const Route = createFileRoute('/browse')({ head: () => pageHead('Browse components', 'Explore RicoUI components on a draggable canvas or in a list.', '/browse'), component: BrowsePage })

function BrowsePage() {
  const theme = useSiteTheme()
  const reduced = useReducedMotion()
  const [view, setView] = useState<'canvas' | 'list'>('canvas')
  const { paused, toggle } = useMediaPlayback()


  return <main id="main-content" className="browse-experience">
    <h1 className="sr-only">Browse components</h1>
    <div className="browse-workspace">
    <div className="browse-surface" data-view={view} data-background={browseBackground}>
      {browseBackground === 'ascii' && <div className="browse-background" aria-hidden="true"><AsciiBackground theme={theme} style={{ minHeight: 0 }} /></div>}
      <AnimatePresence mode="wait" initial={false}><motion.div className="browse-view" key={view} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .16 }}>
        {view === 'canvas' ? <BrowseCanvas components={publishedComponents} paused={paused} /> : <div className="browse-list">{publishedComponents.map(component => <BrowseCard key={component.slug} component={component} paused={paused} />)}</div>}
      </motion.div></AnimatePresence>
    </div></div>
    <div className="browse-dock"><div className="browse-view-switch" role="group" aria-label="Browse layout">{(['canvas', 'list'] as const).map(mode => <motion.button key={mode} type="button" title={mode === 'canvas' ? 'Canvas' : 'List'} aria-label={mode === 'canvas' ? 'Canvas view' : 'List view'} aria-pressed={view === mode} onClick={() => setView(mode)} whileTap={reduced ? undefined : { scale: .92 }}>
      {view === mode && <motion.span className="browse-view-indicator" layoutId="browse-active-view" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 34 }} />}
      {mode === 'canvas' ? <LayoutGrid size={21} strokeWidth={1.8} /> : <Rows3 size={21} strokeWidth={1.8} />}
    </motion.button>)}</div>
      <button type="button" className="browse-media-toggle" onClick={toggle} aria-label={paused ? 'Play component videos' : 'Pause component videos'} title={paused ? 'Play component videos' : 'Pause component videos'}>
        {paused ? <Play size={20} strokeWidth={1.8} /> : <Pause size={20} strokeWidth={1.8} />}
      </button>
    </div>
  </main>
}
