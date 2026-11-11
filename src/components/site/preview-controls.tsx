import { useId, useLayoutEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react'
import { Icon } from './icon'
import { CopyButton } from './code-block'
import { buildPreviewPrompt, type PreviewPrompt } from '../../lib/preview-prompt'

type Position = { x: number; y: number }

export function PreviewControls({ children, inline = false, prompt, onReset }: { children: ReactNode; inline?: boolean; prompt: PreviewPrompt; onReset?: () => void }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const [bounds, setBounds] = useState({ width: 320, height: 600 })
  const [dragging, setDragging] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const moved = useRef(false)
  const drag = useRef<{ position: Position; startX: number; startY: number } | null>(null)
  const id = useId()

  function clamp(x: number, y: number, expanded = open): Position {
    const node = root.current, parent = node?.parentElement
    if (!node || !parent) return { x, y }
    const room = expanded ? Math.min(108, Math.max(0, parent.clientHeight - node.offsetHeight - 24)) : 0
    return {
      x: Math.max(12, Math.min(x, parent.clientWidth - node.offsetWidth - 12)),
      y: Math.max(12, Math.min(y, parent.clientHeight - node.offsetHeight - room - 12)),
    }
  }

  function defaultPosition(): Position {
    const node = root.current, parent = node?.parentElement
    if (!node || !parent) return { x: 12, y: 16 }
    const tools = parent.querySelector<HTMLElement>('.detail-preview-tools')
    if (!tools) return clamp(parent.clientWidth - node.offsetWidth - 16, 16)
    let x = tools.offsetLeft - node.offsetWidth - 8, y = tools.offsetTop
    const mobileNav = parent.closest('.component-detail-shell')?.querySelector<HTMLElement>('.detail-mobile-nav-trigger')
    const minX = mobileNav && getComputedStyle(mobileNav).display !== 'none'
      ? mobileNav.getBoundingClientRect().right - parent.getBoundingClientRect().left + 8 : 12
    if (x < minX) { x = tools.offsetLeft + tools.offsetWidth - node.offsetWidth; y += tools.offsetHeight + 8 }
    return clamp(x, y)
  }

  useLayoutEffect(() => {
    const node = root.current, parent = node?.parentElement
    if (!node || !parent) return
    function measure() {
      if (!parent) return
      setBounds(previous => previous.width === parent.clientWidth && previous.height === parent.clientHeight
        ? previous : { width: parent.clientWidth, height: parent.clientHeight })
      setPosition(previous => {
        const next = moved.current && previous ? clamp(previous.x, previous.y) : defaultPosition()
        return previous?.x === next.x && previous.y === next.y ? previous : next
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    observer.observe(node)
    const tools = parent.querySelector('.detail-preview-tools')
    if (tools) observer.observe(tools)
    return () => observer.disconnect()
  }, [open])

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !position) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    moved.current = true
    drag.current = { position, startX: event.clientX, startY: event.clientY }
    setDragging(true)
  }

  const panelWidth = Math.min(320, bounds.width - 24)
  const panelLeft = position ? Math.max(12 - position.x, (root.current?.offsetWidth || 144) - panelWidth) : undefined
  const panelMaxHeight = Math.max(60, Math.min(440, bounds.height - (position?.y || 16) - (root.current?.offsetHeight || 44) - 20))

  return <div ref={root} className="preview-dock t-acc" data-open={open} data-dragging={dragging}
    style={position ? { left: position.x, top: position.y, right: 'auto' } : undefined}
    onKeyDown={event => { if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); toggle.current?.focus() } }}>
    <div className="dock-bar">
      <button className="dock-grip" aria-label="Move preview controls. Use arrow keys to move, Home to reset." title="Drag to move" onPointerDown={start}
        onPointerMove={event => {
          if (!drag.current) return
          setPosition(clamp(drag.current.position.x + event.clientX - drag.current.startX, drag.current.position.y + event.clientY - drag.current.startY))
        }}
        onPointerUp={event => { drag.current = null; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
        onPointerCancel={() => { drag.current = null; setDragging(false) }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false) }}
        onKeyDown={event => {
          const moves: Record<string, [number, number]> = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }
          if (event.key === 'Home') { event.preventDefault(); moved.current = false; setPosition(defaultPosition()) }
          if (moves[event.key] && position) { event.preventDefault(); moved.current = true; const [x, y] = moves[event.key]; setPosition(clamp(position.x + x, position.y + y)) }
        }}><Icon name="grip" size={14} /></button>
      {inline ? <>{children}<CopyButton text={buildPreviewPrompt(prompt)} label="Copy prompt" buttonLabel="Copy prompt" captureOnPointerDown /></> : <button ref={toggle} className="dock-toggle" aria-label="Preview settings" title="Preview settings" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><Icon name="settings" size={16} /></button>}
    </div>
    {!inline && <div ref={popup} id={id} className="dock-popup t-acc-panel" inert={!open} style={{ width: panelWidth, left: panelLeft }}>
      <div className="t-acc-panel-inner"><div className="dock-popup-surface" style={{ maxHeight: panelMaxHeight }}>
        <div className="dock-panel-heading"><strong>Customize</strong>{onReset && <button type="button" onClick={onReset} className="dock-reset"><Icon name="reset" size={12} /> Reset</button>}</div>
        <div className="dock-panel-fields">{children}</div>
        <div className="dock-panel-footer"><CopyButton text={buildPreviewPrompt(prompt)} label="Copy prompt" buttonLabel="Copy prompt" captureOnPointerDown /></div>
      </div></div>
    </div>}
  </div>
}
