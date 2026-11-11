import { useEffect, useRef, type ReactNode } from 'react'
import './pixel-reveal.css'

// Adapted from the supplied React Bits PixelCard by David Haz.
// Shared React Bits license notice: ./TECH-TEXT-LICENSE.md
type PixelRevealProps = { children: ReactNode; className?: string; gap?: number }
type Pixel = { x: number; y: number; size: number; phase: number; delay: number; amount: number; tone: number; glyph: string | null }

export function PixelReveal({ children, className = '', gap = 12 }: PixelRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!container || !canvas || !ctx) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let pixels: Pixel[] = []
    let colors: string[] = []
    let width = 0, height = 0, frame = 0, last = 0, elapsed = 0, clock = 0
    let hovered = false, focused = false, visible = true
    const active = () => hovered || focused

    function draw(now: number) {
      frame = 0
      const dt = Math.min((now - last) / 1000, .05)
      last = now
      elapsed += dt
      clock += dt
      ctx!.clearRect(0, 0, width, height)
      ctx!.font = '9px Consolas, monospace'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      let fading = false
      for (const pixel of pixels) {
        const target = active() && (motion.matches || elapsed >= pixel.delay) ? 1 : 0
        pixel.amount = motion.matches ? target : Math.max(0, Math.min(1, pixel.amount + (target ? dt * 4 : -dt * 5)))
        if (!pixel.amount) continue
        fading = true
        const shimmer = motion.matches ? 1 : .85 + .15 * Math.sin(clock * .8 + pixel.phase)
        const size = pixel.size * shimmer
        // Keep the copy quiet; fine marks become more visible toward the artwork.
        const weight = .2 + .8 * Math.min(1, Math.max(0, (pixel.x / width - .24) / .3))
        ctx!.globalAlpha = pixel.amount * (pixel.glyph ? .34 : .24) * shimmer * weight
        ctx!.fillStyle = colors[pixel.tone]
        if (pixel.glyph) ctx!.fillText(pixel.glyph, pixel.x, pixel.y)
        else ctx!.fillRect(pixel.x - size / 2, pixel.y - size / 2, size, size)
      }
      ctx!.globalAlpha = 1
      if (!motion.matches && (active() || fading)) wake()
    }
    function wake() {
      if (frame || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(draw)
    }
    function stop() { cancelAnimationFrame(frame); frame = 0 }
    function readTheme() {
      const style = getComputedStyle(container!)
      colors = [style.getPropertyValue('--brand').trim(), style.getPropertyValue('--brand-light').trim()]
      wake()
    }
    function resize() {
      width = container!.clientWidth
      height = container!.clientHeight
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const spacing = Math.max(6, Number.isFinite(gap) ? gap : 12, Math.sqrt(width * height / 6000))
      pixels = []
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const glyphs = [':', '+', '/', '*', '=', '0', '1']
          pixels.push({ x, y, size: .55 + Math.random() * .4, phase: Math.random() * Math.PI * 2, delay: Math.hypot(x - width / 2, y - height / 2) / 1200, amount: 0, tone: Math.random() < .7 ? 0 : 1, glyph: Math.random() < .14 ? glyphs[Math.floor(Math.random() * glyphs.length)] : null })
        }
      }
      wake()
    }
    function enter(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      if (!active()) elapsed = 0
      hovered = true
      wake()
    }
    function leave() { hovered = false; wake() }
    function focusIn() { if (!active()) elapsed = 0; focused = true; wake() }
    function focusOut(event: FocusEvent) {
      focused = event.relatedTarget instanceof Node && container!.contains(event.relatedTarget)
      wake()
    }
    function visibilityChanged() { if (document.hidden) stop(); else wake() }
    const resizeObserver = new ResizeObserver(resize)
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake(); else stop()
    })
    const theme = new MutationObserver(readTheme)
    readTheme()
    resize()
    resizeObserver.observe(container)
    intersection.observe(container)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    container.addEventListener('pointerenter', enter)
    container.addEventListener('pointerleave', leave)
    container.addEventListener('focusin', focusIn)
    container.addEventListener('focusout', focusOut)
    document.addEventListener('visibilitychange', visibilityChanged)
    motion.addEventListener('change', wake)
    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      theme.disconnect()
      container.removeEventListener('pointerenter', enter)
      container.removeEventListener('pointerleave', leave)
      container.removeEventListener('focusin', focusIn)
      container.removeEventListener('focusout', focusOut)
      document.removeEventListener('visibilitychange', visibilityChanged)
      motion.removeEventListener('change', wake)
    }
  }, [gap])

  return <div ref={containerRef} className={`pixel-reveal ${className}`}><canvas ref={canvasRef} className="pixel-reveal-canvas" aria-hidden="true" />{children}</div>
}
