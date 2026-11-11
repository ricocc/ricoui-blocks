import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export function useWorkspaceExpand() {
  const [expanded, setExpanded] = useState(false)
  const workspace = useRef<HTMLElement>(null)
  const previous = useRef<DOMRect | null>(null)
  const animation = useRef<Animation | null>(null)
  const changeExpanded = useCallback((next: boolean) => {
    previous.current = workspace.current?.getBoundingClientRect() || null
    animation.current?.cancel()
    setExpanded(next)
  }, [])
  useLayoutEffect(() => {
    const node = workspace.current
    const from = previous.current
    previous.current = null
    if (!node || !from || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const to = node.getBoundingClientRect()
    if (!to.width || !to.height) return
    const styles = getComputedStyle(node)
    const duration = parseFloat(styles.getPropertyValue('--resize-dur')) || 400
    const easing = styles.getPropertyValue('--resize-ease').trim() || 'ease-out'
    // FLIP bridges relative/fixed layout in both directions without remounting the preview.
    animation.current = node.animate([
      { transformOrigin: 'top left', transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, zIndex: 50 },
      { transformOrigin: 'top left', transform: 'translate(0, 0) scale(1, 1)', zIndex: 50 },
    ], { duration, easing })
    return () => { animation.current?.cancel() }
  }, [expanded])
  return { expanded, changeExpanded, workspace }
}
