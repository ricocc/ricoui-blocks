import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import type { ComponentMeta } from '../../data/components'
import { ComponentMedia } from './component-media'
import { Icon } from './icon'

// Website composition only; distributed components keep their own dimensions.
export function browseCardHeight(width: number) {
  return Math.round((width - 14) * 10 / 16) + 48
}

export function BrowseCard({ component, height, paused }: { component: ComponentMeta; height?: number; paused: boolean }) {
  const reduced = useReducedMotion()
  return <motion.article className="browse-card" style={{ height }} whileHover={reduced ? undefined : { y: -3 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
    <Link className="browse-card-link" to="/components/$slug" params={{ slug: component.slug }}>
      <span className="browse-tile-caption"><strong>{component.name}</strong><Icon name="external" size={15} /></span>
      <span className="browse-tile-preview">
        <ComponentMedia slug={component.slug} mode="auto" paused={paused} />
      </span>
    </Link>
  </motion.article>
}
