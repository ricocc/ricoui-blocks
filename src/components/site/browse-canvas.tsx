import { motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import type { ComponentMeta } from '../../data/components'
import { BrowseCard, browseCardHeight } from './browse-card'

const modulo = (value: number, length: number) => ((value % length) + length) % length

export function BrowseCanvas({ components, paused }: { components: ComponentMeta[]; paused: boolean }) {
  const viewport = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const reduced = useReducedMotion()
  const pointer = useRef<{ id: number; x: number; y: number; startX: number; startY: number; time: number; vx: number; vy: number; dragging: boolean } | null>(null)
  const suppressClick = useRef(false)
  const coastFrame = useRef(0)
  const [coasting, setCoasting] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [dragging, setDragging] = useState(false)
  const cardWidth = size.width < 600 ? 290 : 410
  const cardHeight = browseCardHeight(cardWidth)
  const gap = size.width < 600 ? 24 : 32

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    observer.observe(element)
    let frame = 0
    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        // Overscan absorbs small movements; React only updates the tile window.
        setPosition(previous => Math.abs(previous.x - x.get()) > 100 || Math.abs(previous.y - y.get()) > 100 ? { x: x.get(), y: y.get() } : previous)
      })
    }
    const offX = x.on('change', update)
    const offY = y.on('change', update)
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      cancelAnimationFrame(coastFrame.current); setCoasting(false)
      x.stop(); y.stop()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1
      x.set(x.get() - event.deltaX * unit)
      y.set(y.get() - event.deltaY * unit)
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => { observer.disconnect(); offX(); offY(); cancelAnimationFrame(frame); cancelAnimationFrame(coastFrame.current); x.stop(); y.stop(); element.removeEventListener('wheel', wheel) }
  }, [x, y])

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => {
      if (preference.matches) { cancelAnimationFrame(coastFrame.current); setCoasting(false) }
    }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])

  function stopCoasting() {
    cancelAnimationFrame(coastFrame.current)
    setCoasting(false)
  }

  function coast(vx: number, vy: number) {
    const speed = Math.hypot(vx, vy)
    if (speed < 35) return
    const limit = Math.min(1, 2400 / speed)
    vx *= limit; vy *= limit
    let last = performance.now()
    setCoasting(true)
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, .064)
      last = now
      // Integrate exponential friction independently of display refresh rate.
      const friction = 4.8
      const decay = Math.exp(-friction * dt)
      x.set(x.get() + vx * (1 - decay) / friction)
      y.set(y.get() + vy * (1 - decay) / friction)
      vx *= decay; vy *= decay
      if (Math.hypot(vx, vy) > 8) coastFrame.current = requestAnimationFrame(step)
      else setCoasting(false)
    }
    coastFrame.current = requestAnimationFrame(step)
  }

  const tiles = useMemo(() => {
    if (!size.width || !components.length) return []
    const result: { key: string; left: number; top: number; component: ComponentMeta }[] = []
    const columnStep = cardWidth + gap
    const rowStep = cardHeight + gap
    // Span the viewport before repeating the sequence on the next row.
    const columns = Math.ceil((size.width + cardWidth) / columnStep)
    const rowStride = components.length % columns === 0 ? columns + 1 : columns
    const origin = size.width < 600 ? 24 : (size.width - cardWidth) / 2
    const minCol = Math.floor((-position.x - origin - cardWidth - 200) / columnStep)
    const maxCol = Math.ceil((size.width - position.x - origin + 200) / columnStep)
    for (let col = minCol; col <= maxCol; col++) {
      const offset = [24, -24, 40, -8][modulo(col, 4)]
      const minRow = Math.floor((-position.y - offset - cardHeight - 200) / rowStep)
      const maxRow = Math.ceil((size.height - position.y - offset + 200) / rowStep)
      for (let row = minRow; row <= maxRow; row++) {
        const component = components[modulo(row * rowStride + col, components.length)]
        result.push({ key: `${col}:${row}:${component.slug}`, left: origin + col * columnStep, top: row * rowStep + offset, component })
      }
    }
    return result
  }, [components, cardWidth, cardHeight, gap, position, size])

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pointer.current || (event.target as HTMLElement).closest('input, textarea, select')) return
    suppressClick.current = coasting; stopCoasting(); x.stop(); y.stop()
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, time: performance.now(), vx: 0, vy: 0, dragging: false }
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = pointer.current
    if (!current || current.id !== event.pointerId) return
    if (!current.dragging && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 6) return
    if (!current.dragging) { event.currentTarget.setPointerCapture(event.pointerId); current.dragging = true; setDragging(true) }
    const now = performance.now()
    const elapsed = Math.max(8, now - current.time)
    const dx = event.clientX - current.x, dy = event.clientY - current.y
    const blend = 1 - Math.exp(-elapsed / 40)
    current.vx += (dx / elapsed * 1000 - current.vx) * blend
    current.vy += (dy / elapsed * 1000 - current.vy) * blend
    x.set(x.get() + dx); y.set(y.get() + dy)
    current.x = event.clientX; current.y = event.clientY; current.time = now
  }
  function finish(event: PointerEvent<HTMLDivElement>, cancel = false) {
    const current = pointer.current
    if (!current || current.id !== event.pointerId) return
    if (current.dragging) {
      suppressClick.current = true
      const idle = performance.now() - current.time
      if (!cancel && !reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches && idle < 140) coast(current.vx * Math.exp(-idle / 80), current.vy * Math.exp(-idle / 80))
    }
    pointer.current = null; setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return
    event.preventDefault(); event.stopPropagation(); suppressClick.current = false
  }
  return <div ref={viewport} className="browse-canvas" data-dragging={dragging} data-coasting={coasting} tabIndex={0} aria-label="Component canvas. Drag, scroll, or use arrow keys to explore." onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => finish(event, true)} onClickCapture={onClickCapture} onDragStart={event => event.preventDefault()} onKeyDown={event => {
    if (event.target !== event.currentTarget) return
    const directions: Record<string, [number, number]> = { ArrowLeft: [100, 0], ArrowRight: [-100, 0], ArrowUp: [0, 100], ArrowDown: [0, -100] }
    const delta = directions[event.key]
    if (delta) { event.preventDefault(); stopCoasting(); x.stop(); y.stop(); x.set(x.get() + delta[0]); y.set(y.get() + delta[1]) }
  }}>
    <motion.div className="browse-canvas-stage" style={{ x, y }}>
      {tiles.map(tile => <div className="browse-tile" key={tile.key} style={{ width: cardWidth, height: cardHeight, transform: `translate3d(${tile.left}px, ${tile.top}px, 0)` }}><BrowseCard component={tile.component} height={cardHeight} paused={paused} /></div>)}
    </motion.div>
    <div className="canvas-readout" aria-hidden="true"><span className="canvas-motion-mark">{dragging ? '[ = ]' : coasting ? '[ ~ ]' : '[ . ]'}</span>{dragging ? 'IN HAND' : coasting ? 'DRIFTING' : 'DRAG TO EXPLORE'}</div>
  </div>
}
