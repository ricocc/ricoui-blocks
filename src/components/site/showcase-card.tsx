import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { ComponentMeta } from '../../data/components'
import { getCategoryLabel } from '../../data/components'
import { ComponentMedia } from './component-media'
import { Icon } from './icon'

export function ShowcaseCard({ component, mode = 'auto', paused }: { component: ComponentMeta; mode?: 'auto' | 'hover'; paused?: boolean }) {
  const [active, setActive] = useState(false)
  return <article className={'showcase-card showcase-' + component.slug}
    onPointerEnter={event => { if (event.pointerType !== 'touch') setActive(true) }}
    onPointerLeave={() => setActive(false)}
    onFocus={() => setActive(true)}
    onBlur={() => setActive(false)}>
    <Link className="showcase-card-link" to="/components/$slug" params={{ slug: component.slug }}>
      <div className="showcase-preview"><ComponentMedia slug={component.slug} mode={mode} active={active} paused={paused} /></div>
      <div className="showcase-caption">
        <div><h3>{component.name}</h3><p>{getCategoryLabel(component.category)}</p></div><span className="card-arrow"><Icon name="external" /></span>
      </div>
    </Link>
  </article>
}
