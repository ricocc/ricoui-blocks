"use client"

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'

export type ContributionDay = { date: string; count: number }
export type ContributionGraphProps = {
  data: ContributionDay[]
  endDate?: string
  animation?: 'always' | 'none'
  onDayHover?: (day: ContributionDay | null) => void
  title?: string
  className?: string
  style?: CSSProperties
}

const DAY_MS = 86400000
const LEVELS = [0, 1, 2, 3, 4] as const
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

function parseDate(date: string) {
  const time = Date.parse(date + 'T00:00:00Z')
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date ? time : NaN
}

// Decorative summaries share the calendar's fixed pixel grid; text remains authoritative.
function StatDetail({ type, count, weekdays }: { type: number; count: number; weekdays: number[] }) {
  const peak = Math.max(1, ...weekdays)
  const size = type === 2 ? 7 : Math.min(6, Math.max(1, count))
  return <div className="cg-stat-detail" data-kind={type} aria-hidden="true">
    {Array.from({ length: size }, (_, i) => {
      const day = (i + 1) % 7 // Monday through Sunday.
      const height = type === 2 ? Math.max(2, Math.round(weekdays[day] / peak * 18 / 3) * 3)
        : type === 0 ? (count ? Math.round((i + 1) / size * 6) * 3 : 2) : 6
      return <i key={i} data-active={type === 2 ? weekdays[day] > 0 && weekdays[day] === peak : count > 0}
        data-tip={type === 1 && count > 0 && i === size - 1}
        style={{ height, '--cg-step': i } as CSSProperties} />
    })}
  </div>
}

function StatIcon({ type }: { type: number }) {
  return <svg className="cg-stat-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 0 ? <path d="M8.5 1.8c.3 2.5-2.2 3-2 5.3-.8-.3-1.3-.8-1.5-1.5-1.5 1.4-2 2.6-2 4.2a5 5 0 0 0 10 0c0-2.2-1.6-4.9-4.5-8Z M6.3 11.1c0-1 .7-1.8 1.7-2.5 1 .7 1.7 1.5 1.7 2.5a1.7 1.7 0 0 1-3.4 0Z" />
      : type === 1 ? <path d="M9 1.8 3.6 8.4h3.5l-.6 5.8 5.9-7.1H8.8L9 1.8Z" />
      : <><rect x="2.5" y="3.6" width="11" height="9.7" rx="1"/><path d="M5 2.1v3M11 2.1v3M2.5 6.6h11M5.4 9h.1M8 9h.1M10.6 9h.1M5.4 11.1h.1M8 11.1h.1M10.6 11.1h.1"/></>}
  </svg>
}

function CharacterPet({ animate }: { animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const input = useRef({ x: 0, y: 0, near: false, hover: false, focus: false, click: 0 })
  const [greeting, setGreeting] = useState(false)
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (greetingTimer.current) clearTimeout(greetingTimer.current) }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const root = canvas.closest('section')!
    const mask = document.createElement('canvas')
    mask.width = 320
    mask.height = 210
    const shape = mask.getContext('2d', { willReadFrequently: true })
    if (!shape) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true, frame = 0, last = 0, elapsed = 0, phase = 0
    let walk = 0, lookX = 0, lookY = 0, velocityX = 0, velocityY = 0
    let attention = 0, affection = 0, reaction = 10, click = 0, nextDraw = 0
    let inkColor = '#2d6dc3', paperColor = '#fafcfe'

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== 320 * scale || canvas.height !== 210 * scale) {
        canvas.width = 320 * scale
        canvas.height = 210 * scale
      }
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.imageSmoothingEnabled = false
    }
    const colors = () => {
      inkColor = getComputedStyle(canvas).color
      paperColor = getComputedStyle(root).backgroundColor
      wake()
    }
    // Geometry is only a sampling mask. Every visible body mark is a text glyph.
    const head = new Path2D('M96 70 Q84 48 91 23 Q106 22 126 39 Q153 31 185 40 Q205 24 218 30 Q226 49 215 70 Q228 96 210 118 Q192 137 155 137 Q117 138 99 117 Q80 94 96 70Z')
    const face = new Path2D('M103 84 Q103 63 124 69 Q157 78 187 71 Q209 70 209 94 Q208 122 158 123 Q107 123 103 100Z')

    const paint = (now: number) => {
      frame = 0
      // Read the rendered colors each frame, including intermediate CSS transition colors.
      inkColor = getComputedStyle(canvas).color
      paperColor = getComputedStyle(root).backgroundColor
      const dt = Math.min((now - last) / 1000 || 1 / 60, .04)
      last = now
      const isReduced = reduced.matches || !animate
      if (!isReduced) elapsed += dt
      if (click !== input.current.click) { click = input.current.click; reaction = 0 }
      reaction += dt
      const engaged = input.current.hover || input.current.focus || input.current.near || reaction < 2.4
      attention += ((engaged ? 1 : 0) - attention) * (1 - Math.exp(-dt * 5))
      affection += ((reaction < 1.8 ? 1 : 0) - affection) * (1 - Math.exp(-dt * 5))
      if (!isReduced) phase += dt * (1 - attention)
      const targetWalk = isReduced ? 0 : Math.sin(phase * .58) * 36
      walk += (targetWalk - walk) * (1 - Math.exp(-dt * 4))
      const tx = isReduced ? 0 : engaged ? input.current.x : Math.cos(phase * .58) * .32
      const ty = isReduced ? 0 : input.current.y
      velocityX += ((tx - lookX) * 85 - velocityX * 15) * dt
      velocityY += ((ty - lookY) * 85 - velocityY * 15) * dt
      lookX += velocityX * dt
      lookY += velocityY * dt
      const mood = isReduced ? (reaction < 2.4 ? 1 : 0) : affection
      const tilt = isReduced ? -.06 : -.06 + lookX * .065 + mood * Math.sin(elapsed * 3.5) * .08
      const bodyY = isReduced ? 0 : Math.sin(elapsed * 1.8) * 1.2 + mood * 2
      const actorTransform = (context: CanvasRenderingContext2D) => {
        context.translate(walk, bodyY)
      }
      const headTransform = (context: CanvasRenderingContext2D) => {
        context.translate(156, 100)
        context.rotate(tilt)
        context.translate(-156, -100)
      }

      // Limit sampling to 30fps; springs still integrate on animation frames.
      if (now >= nextDraw) {
        nextDraw = now + 1000 / 30
        shape.clearRect(0, 0, 320, 210)
        shape.save()
        actorTransform(shape)
        shape.strokeStyle = '#454545'
        shape.lineWidth = 12
        shape.lineCap = 'round'
        for (let i = 0; i < 4; i++) {
          const base = 126 + i * 19
          const end = 99 + i * 33
          const sway = isReduced ? 0 : Math.sin(elapsed * 2.4 + i * 1.3) * (3 + attention * 2)
          shape.beginPath()
          shape.moveTo(base, 128)
          shape.bezierCurveTo(base - 5, 158, end - 12, 181 + sway, end + 13, 164 + sway)
          shape.stroke()
        }
        // A greeting arm curls up instead of moving the whole body vertically.
        const wave = isReduced ? 0 : mood * Math.sin(elapsed * 7) * 8
        shape.beginPath()
        shape.moveTo(120, 124)
        shape.bezierCurveTo(82, 154 - mood * 30, 76, 107 - mood * 20, 59 + wave, 114 - mood * 26)
        shape.stroke()
        shape.save()
        headTransform(shape)
        const shade = shape.createLinearGradient(95, 32, 218, 140)
        shade.addColorStop(0, '#a4a4a4')
        shade.addColorStop(.45, '#575757')
        shade.addColorStop(1, '#171717')
        shape.fillStyle = shade
        shape.fill(head)
        shape.fillStyle = '#fff'
        shape.fill(face)
        shape.restore()
        shape.restore()

        ctx.clearRect(0, 0, 320, 210)
        ctx.fillStyle = inkColor
        ctx.font = '600 6px ui-monospace, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const pixels = shape.getImageData(0, 0, 320, 210).data
        for (let row = 0; row < 45; row++) {
          for (let col = 0; col < 80; col++) {
            const px = col * 4 + 2, py = row * 4 + 2
            const index = (py * 320 + px) * 4
            if (pixels[index + 3] < 120 || pixels[index] > 248) continue
            const density = 1 - pixels[index] / 255
            const threshold = BAYER[(row % 4) * 4 + col % 4] / 16
            const glyph = density < .35 ? (threshold < .4 ? ':' : '·')
              : density < .65 ? (threshold < .5 ? '+' : '×')
              : threshold < .6 ? '×' : '#'
            ctx.globalAlpha = .65 + density * .35
            ctx.fillText(glyph, px, py)
          }
        }
        ctx.globalAlpha = 1
        ctx.save()
        actorTransform(ctx)
        headTransform(ctx)
        ctx.strokeStyle = inkColor
        ctx.fillStyle = inkColor
        ctx.lineWidth = 2.4
        ctx.lineCap = 'round'
        const blink = !isReduced && elapsed % 5.8 > 5.65
        for (const ex of [128, 183]) {
          if (attention > .55 && mood < .3 && !blink) {
            ctx.beginPath()
            ctx.ellipse(ex + lookX * 4, 94 + lookY * 3, 2.8, 5.6, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = paperColor
            ctx.fillRect(ex + lookX * 4 - 1, 90 + lookY * 3, 1.5, 2)
            ctx.fillStyle = inkColor
          } else {
            ctx.beginPath()
            ctx.moveTo(ex - 6, 96)
            ctx.quadraticCurveTo(ex, blink ? 96 : 86, ex + 6, 96)
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.moveTo(151, 109)
        ctx.quadraticCurveTo(157, 116 + mood * 2, 163, 109)
        ctx.stroke()
        ctx.font = '8px monospace'
        ctx.globalAlpha = .4 + mood * .4
        ctx.fillText('::', 116, 109)
        ctx.fillText('::', 198, 109)
        ctx.restore()
        ctx.globalAlpha = 1

        // Ground and orbit marks use the same weave as the statistics and calendar.
        ctx.font = '8px monospace'
        ctx.fillStyle = inkColor
        for (let row = 0; row < 3; row++) {
          ctx.globalAlpha = .32 - row * .075
          for (let col = 0; col < 30; col++) {
            const glyph = (col + row) % 5 === 0 ? '+' : '·'
            ctx.fillText(glyph, 25 + col * 9, 185 + row * 7)
          }
        }
        ctx.globalAlpha = .45 + attention * .3
        ctx.font = '10px monospace'
        ctx.fillText(':', 47 + walk, 77 + Math.sin(elapsed) * 2)
        ctx.fillText('+', 250 + walk, 133)
        if (mood > .05) {
          ctx.globalAlpha = mood
          ctx.font = '12px monospace'
          ctx.fillText(reaction < 1.2 ? '<3' : '+1', 239 + walk, 48)
        }
        ctx.globalAlpha = 1
      }
      if (visible && !document.hidden && (!isReduced || reaction < 2.8)) {
        frame = requestAnimationFrame(paint)
      }
    }
    function wake() {
      if (!frame && visible && !document.hidden) {
        last = performance.now()
        nextDraw = 0
        frame = requestAnimationFrame(paint)
      }
    }
    const pointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      const cx = bounds.left + bounds.width / 2
      const cy = bounds.top + bounds.height / 2
      input.current.x = Math.max(-1, Math.min(1, (event.clientX - cx) / (bounds.width * .65)))
      input.current.y = Math.max(-1, Math.min(1, (event.clientY - cy) / bounds.height))
      input.current.near = event.clientX > bounds.left - 28 && event.clientX < bounds.right + 28
        && event.clientY > bounds.top - 28 && event.clientY < bounds.bottom + 28
      wake()
    }
    const leave = () => { input.current.near = false; input.current.x = 0; input.current.y = 0; wake() }
    const interaction = () => wake()
    const onResize = () => { resize(); wake() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
      else { cancelAnimationFrame(frame); frame = 0 }
    })
    const themeObserver = new MutationObserver(colors)
    for (let el: Element | null = root; el; el = el.parentElement) {
      themeObserver.observe(el, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    }
    resize()
    colors()
    root.addEventListener('transitionend', colors)
    observer.observe(canvas)
    root.addEventListener('pointermove', pointer)
    root.addEventListener('pointerleave', leave)
    canvas.parentElement?.addEventListener('click', interaction)
    canvas.parentElement?.addEventListener('focus', interaction)
    document.addEventListener('visibilitychange', wake)
    window.addEventListener('resize', onResize)
    reduced.addEventListener('change', wake)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('transitionend', colors)
      observer.disconnect()
      themeObserver.disconnect()
      root.removeEventListener('pointermove', pointer)
      root.removeEventListener('pointerleave', leave)
      canvas.parentElement?.removeEventListener('click', interaction)
      canvas.parentElement?.removeEventListener('focus', interaction)
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('resize', onResize)
      reduced.removeEventListener('change', wake)
    }
  }, [animate])

  return <button type="button" className="cg-pet" aria-label="Pet the Octocat"
    onPointerEnter={() => { input.current.hover = true }}
    onPointerLeave={() => { input.current.hover = false }}
    onFocus={() => { input.current.focus = true }}
    onBlur={() => { input.current.focus = false }}
    onClick={() => {
      input.current.click++
      setGreeting(true)
      if (greetingTimer.current) clearTimeout(greetingTimer.current)
      greetingTimer.current = setTimeout(() => setGreeting(false), 2600)
    }}>
    <canvas ref={canvasRef} width={320} height={210} aria-hidden="true" />
    <span className="cg-pet-hint" aria-live="polite">{greeting ? '[ hello, friend! ]' : '[ say hello ]'}</span>
  </button>
}

const styles = `
#SCOPE{--cg-ink:var(--brand,#2d6dc3);--cg-text:color-mix(in srgb,var(--cg-ink) 35%,var(--foreground,#243e58));--cg-muted:color-mix(in srgb,var(--cg-ink) 55%,var(--foreground-muted,#646d73));--cg-line:color-mix(in srgb,var(--cg-ink) 57%,var(--border,#bccbdc));--cg-soft:color-mix(in srgb,var(--cg-ink) 3%,var(--surface,#fafcfe));position:relative;isolation:isolate;width:100%;max-width:880px;min-width:0;container-type:inline-size;container-name:contribution;contain:inline-size;padding:clamp(18px,2.8vw,28px);border:1px dotted var(--cg-line);border-radius:3px;background:var(--surface,#fafcfe);color:var(--cg-text);font-family:var(--font-mono,ui-monospace,monospace);text-align:left}
#SCOPE,#SCOPE *{box-sizing:border-box}
#SCOPE .cg-top{display:flex;gap:16px;align-items:center;color:var(--cg-ink);font-size:10px;letter-spacing:.12em}
#SCOPE .cg-badge{border:1px dotted var(--cg-ink);padding:6px 10px;white-space:nowrap}
#SCOPE .cg-rule{position:relative;flex:1;border-top:1px dotted var(--cg-line)}
#SCOPE .cg-rule::after{content:"+";position:absolute;top:-8.5px;left:0;font-size:10px;background:var(--surface,#fafcfe);animation:SCOPE-signal 18s linear infinite}
#SCOPE .cg-signature{white-space:nowrap}
#SCOPE .cg-hero{position:relative;min-height:150px;padding:22px 215px 22px 0}
#SCOPE h2{color:var(--cg-muted);margin:0 0 12px;font:inherit;font-size:11px;letter-spacing:.13em;text-transform:uppercase}
#SCOPE .cg-total-row{display:flex;align-items:baseline;gap:19px}
#SCOPE .cg-total{font-family:var(--font-sans,system-ui,sans-serif);font-size:clamp(40px,6vw,62px);letter-spacing:-.055em;line-height:1.1;font-weight:650;font-variant-numeric:tabular-nums}
#SCOPE .cg-total-row>span{font-size:12px;color:var(--cg-muted)}
#SCOPE .cg-pet{position:absolute;right:-6px;bottom:4px;width:210px;border:0;padding:0;background:none;color:var(--cg-ink);cursor:pointer;border-radius:6px}
#SCOPE .cg-pet canvas{display:block;width:100%;height:auto}
#SCOPE .cg-pet:focus-visible{outline:2px dotted var(--cg-ink);outline-offset:3px}
#SCOPE .cg-pet-hint{position:absolute;bottom:-1px;left:0;right:0;font:9px var(--font-mono,monospace);letter-spacing:.1em;color:var(--cg-ink);opacity:0;transition:opacity .3s}
#SCOPE .cg-pet:hover .cg-pet-hint,#SCOPE .cg-pet:focus-visible .cg-pet-hint{opacity:.8}
#SCOPE .cg-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px dotted var(--cg-line);border-radius:7px;background:var(--cg-soft);overflow:hidden;margin:0 0 20px}
#SCOPE .cg-stat{position:relative;min-width:0;padding:14px 16px 12px;transition:background .3s}
#SCOPE .cg-stat+.cg-stat{border-left:1px dotted var(--cg-line)}
#SCOPE .cg-stat:hover{background:color-mix(in srgb,var(--cg-ink) 5%,var(--surface,#fafcfe))}
#SCOPE .cg-stat small{color:var(--cg-muted);display:block;font-size:10px;text-transform:uppercase;letter-spacing:.07em;margin:0 28px 9px 0}
#SCOPE .cg-stat strong{font-family:var(--font-sans,system-ui,sans-serif);font-size:clamp(18px,2.3vw,24px);font-weight:450;letter-spacing:-.04em;word-spacing:-.12em;line-height:1.25}
#SCOPE .cg-stat-mark{position:absolute;right:14px;top:14px;width:16px;height:16px;color:var(--cg-ink);opacity:.8}
#SCOPE .cg-stat-detail{height:20px;margin-top:9px;display:flex;justify-content:flex-end;align-items:flex-end;gap:3px;color:var(--cg-ink);pointer-events:none}
#SCOPE .cg-stat-detail i{display:block;flex:0 0 5px;background-image:radial-gradient(circle at 1px 1px,currentColor .8px,transparent 1px);background-size:3px 3px;opacity:.25;transform-origin:bottom}
#SCOPE .cg-stat-detail i[data-active="true"]{opacity:.55}
#SCOPE .cg-stat-detail[data-kind="1"] i{flex-basis:6px}
#SCOPE .cg-stat-detail[data-kind="2"] i[data-active="true"]{opacity:.85}
#SCOPE .cg-stat-detail i[data-tip="true"]{animation:SCOPE-breathe 3.6s ease-in-out infinite}
#SCOPE .cg-stat:hover .cg-stat-detail i{animation:SCOPE-pixel-light .65s ease-out both;animation-delay:calc(var(--cg-step) * 65ms)}
#SCOPE .cg-map-title{margin:0 0 14px;font-size:11px;color:var(--cg-ink);letter-spacing:.1em}
#SCOPE .cg-heatmap{position:relative;border-top:1px dotted var(--cg-line);border-bottom:1px dotted var(--cg-line);padding:16px 12px 14px}
#SCOPE .cg-corner{position:absolute;width:9px;height:9px;border-color:var(--cg-ink);border-style:solid;pointer-events:none}
#SCOPE .cg-corner:nth-child(1){top:-1px;left:0;border-width:1px 0 0 1px}
#SCOPE .cg-corner:nth-child(2){top:-1px;right:0;border-width:1px 1px 0 0}
#SCOPE .cg-corner:nth-child(3){bottom:-1px;left:0;border-width:0 0 1px 1px}
#SCOPE .cg-corner:nth-child(4){bottom:-1px;right:0;border-width:0 1px 1px 0}
#SCOPE .cg-junctions{position:absolute;left:12%;right:12%;top:-7px;display:flex;justify-content:space-around;font-size:11px;color:var(--cg-ink);pointer-events:none}
#SCOPE .cg-scroll{overflow-x:auto;padding:5px 3px;scrollbar-width:none}
#SCOPE .cg-scroll::-webkit-scrollbar{display:none}
#SCOPE .cg-calendar{width:100%;min-width:0}
#SCOPE .cg-months>span{min-width:0;white-space:nowrap}
#SCOPE .cg-months>span:nth-last-child(-n+2){width:max-content;justify-self:end;text-align:right}
@container contribution (max-width:600px){#SCOPE .cg-calendar{min-width:640px}}
#SCOPE .cg-months{color:var(--cg-muted);display:grid;gap:3px;margin-bottom:10px;font-size:10px}
#SCOPE .cg-days{display:grid;grid-template-rows:repeat(7,1fr);gap:3px}
#SCOPE .cg-cell{position:relative;display:block;aspect-ratio:1;width:100%;min-width:0;border:0;padding:0;border-radius:1px;color:var(--cg-ink);background-color:var(--surface-subtle,color-mix(in srgb,var(--cg-ink) 7%,var(--surface,#fafcfe)));cursor:crosshair;transition:outline-color .15s}
#SCOPE .cg-cell[data-level="1"]{background-image:radial-gradient(currentColor .75px,transparent .9px);background-size:4px 4px}
#SCOPE .cg-cell[data-level="2"]{background-image:linear-gradient(45deg,transparent 44%,currentColor 44%,currentColor 56%,transparent 56%),linear-gradient(-45deg,transparent 44%,currentColor 44%,currentColor 56%,transparent 56%);background-size:4px 4px}
#SCOPE .cg-cell[data-level="3"]{background-image:repeating-conic-gradient(currentColor 0 25%,transparent 0 50%);background-size:2px 2px}
#SCOPE .cg-cell[data-level="4"]{background:var(--cg-ink)}
#SCOPE button.cg-cell:hover,#SCOPE button.cg-cell:focus-visible{z-index:1;outline:1px solid var(--cg-ink);outline-offset:2px}
#SCOPE .cg-legend{color:var(--cg-muted);display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:12px;font-size:10px}
#SCOPE .cg-legend .cg-cell{width:12px;height:12px;border:0;cursor:default}
#SCOPE .cg-footer{color:var(--cg-muted);display:flex;align-items:center;gap:12px;margin-top:18px;min-height:29px;font-size:11px}
#SCOPE .cg-footer-content{display:flex;align-items:center;gap:10px;flex-wrap:wrap;animation:SCOPE-detail .2s ease-out}
#SCOPE .cg-chip{color:var(--cg-text);display:inline-block;border:1px dotted var(--cg-ink);border-radius:5px;padding:5px 9px;white-space:nowrap}
#SCOPE .cg-footer .cg-rule{min-width:20px}
#SCOPE .cg-footer .cg-rule::after{display:none}
@keyframes SCOPE-breathe{0%,100%{opacity:.35}50%{opacity:.8}}
@keyframes SCOPE-pixel-light{0%{filter:brightness(1)}40%{filter:brightness(1.35);opacity:1}100%{filter:brightness(1)}}
@keyframes SCOPE-signal{0%{left:0;opacity:0}5%,95%{opacity:.7}100%{left:100%;opacity:0}}
@keyframes SCOPE-detail{from{opacity:.4;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:720px){
#SCOPE .cg-hero{padding-right:175px;min-height:145px}
#SCOPE .cg-pet{width:180px;right:-10px;bottom:4px}
#SCOPE h2{font-size:10px}
#SCOPE .cg-total-row{display:block}
#SCOPE .cg-total-row>span{display:block;margin-top:6px;font-size:10px}
#SCOPE .cg-stat{padding:13px 10px}
#SCOPE .cg-stat small{font-size:9px;margin-right:0;min-height:24px}
#SCOPE .cg-stat-mark{display:none}
}
@media(max-width:440px){
#SCOPE .cg-hero{padding:20px 105px 20px 0;min-height:145px}
#SCOPE h2{font-size:9px;line-height:1.7;margin-bottom:10px}
#SCOPE .cg-pet{width:140px;right:-14px;bottom:16px}
#SCOPE .cg-top{gap:8px;font-size:9px}
#SCOPE .cg-signature{font-size:9px}
#SCOPE .cg-stat{padding:12px 8px}
#SCOPE .cg-stat strong{font-size:18px}
#SCOPE .cg-heatmap{padding:16px 5px}
#SCOPE .cg-footer{font-size:10px;gap:5px}
#SCOPE .cg-footer .cg-rule{display:none}
}
@media(prefers-reduced-motion:reduce){#SCOPE *,#SCOPE *::after{animation:none!important;transition:none!important}}
#SCOPE[data-motion="none"] *,#SCOPE[data-motion="none"] *::after{animation:none!important;transition:none!important}
`

export function ContributionGraph({ data, endDate, animation = 'always', onDayHover, title = 'Contribution activity', className, style }: ContributionGraphProps) {
  const id = 'cg' + useId().replace(/[^a-z0-9]/gi, '')
  const [active, setActive] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scroll = scrollRef.current
    if (scroll && scroll.scrollWidth > scroll.clientWidth) scroll.scrollLeft = scroll.scrollWidth
  }, [endDate])
  const model = useMemo(() => {
    const validDates = data.map(item => item.date).filter(date => Number.isFinite(parseDate(date)))
    // Use UTC today only when no data or explicit end date is provided.
    const resolvedEnd = endDate ?? validDates.sort().at(-1) ?? new Date().toISOString().slice(0, 10)
    const end = parseDate(resolvedEnd)
    if (!Number.isFinite(end)) return null
    const startDate = new Date(end)
    const endDay = startDate.getUTCDate()
    startDate.setUTCDate(1)
    startDate.setUTCFullYear(startDate.getUTCFullYear() - 1)
    const lastDayOfMonth = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0)).getUTCDate()
    startDate.setUTCDate(Math.min(endDay, lastDayOfMonth))
    startDate.setUTCDate(startDate.getUTCDate() + 1)
    const start = startDate.getTime()
    const counts = new Map<string, number>()
    for (const item of data) {
      if (Number.isFinite(parseDate(item.date)) && Number.isFinite(item.count) && item.count >= 0) {
        counts.set(item.date, (counts.get(item.date) || 0) + Math.floor(item.count))
      }
    }
    const days = Array.from({ length: Math.round((end - start) / DAY_MS) + 1 }, (_, i) => {
      const date = new Date(start + i * DAY_MS).toISOString().slice(0, 10)
      return { date, count: counts.get(date) || 0 }
    })
    let longest = 0, run = 0
    const weekdays = Array<number>(7).fill(0)
    for (const day of days) {
      run = day.count ? run + 1 : 0
      longest = Math.max(longest, run)
      weekdays[new Date(day.date + 'T00:00:00Z').getUTCDay()] += day.count
    }
    const best = days.reduce((a, b) => b.count > a.count ? b : a, days[0])
    const total = days.reduce((sum, day) => sum + day.count, 0)
    const busiest = total ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekdays.indexOf(Math.max(...weekdays))] : '—'
    let current = 0
    for (let i = days[days.length - 1].count ? days.length - 1 : days.length - 2; i >= 0 && days[i].count; i--) current++
    return { days, longest, current, best, total, busiest, weekdays, offset: startDate.getUTCDay(), max: Math.max(1, best.count) }
  }, [data, endDate])

  if (!model) return <div role="alert">Provide a valid endDate (YYYY-MM-DD).</div>
  const { days, offset } = model
  const columns = Math.ceil((days.length + offset) / 7)
  const selected = days.find(day => day.date === active)
  const focusDate = days.some(day => day.date === focused) ? focused : days[days.length - 1].date
  const activate = (date: string | null) => {
    if (date === active) return
    setActive(date)
    onDayHover?.(date ? days.find(day => day.date === date) ?? null : null)
  }
  const level = (count: number) => count ? Math.min(4, Math.ceil(count / model.max * 4)) : 0
  const columnStyle = { gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' }
  const stats = [['Longest streak', model.longest + ' days'], ['Current streak', model.current + ' days'], ['Busiest day', model.busiest]]

  return <section id={id} className={className} style={style} aria-label={title} data-motion={animation}>
    <style>{styles.replaceAll('SCOPE', id)}</style>
    <div className="cg-top">
      <span className="cg-badge">▪ ACTIVITY LOG</span><span className="cg-rule" aria-hidden="true" /><span className="cg-signature" aria-hidden="true">:: / ::</span>
    </div>
    <div className="cg-hero">
      <CharacterPet animate={animation !== 'none'} />
      <h2>{title} · last 12 months</h2>
      <div className="cg-total-row"><strong className="cg-total">{model.total.toLocaleString('en-US')}</strong><span>contributions</span></div>
    </div>
    <div className="cg-stats">{stats.map(([label, value], index) =>
      <div className="cg-stat" key={label}>
        <StatIcon type={index} />
        <small>{label}</small><strong>{value}</strong><StatDetail type={index} count={index === 0 ? model.longest : model.current} weekdays={model.weekdays} />
      </div>
    )}</div>
    <div className="cg-map-title">› CONTRIBUTION HEATMAP</div>
    <div className="cg-heatmap">
      {[0, 1, 2, 3].map(n => <i className="cg-corner" key={n} aria-hidden="true" />)}
      <div className="cg-junctions" aria-hidden="true"><span>+</span><span>+</span><span>+</span><span>+</span></div>
      <div ref={scrollRef} className="cg-scroll" onPointerLeave={event => {
        activate(event.currentTarget.contains(document.activeElement) ? focused : null)
      }}>
        <div className="cg-calendar">
          <div className="cg-months" style={columnStyle}>{Array.from({ length: columns }, (_, week) => {
            const index = Math.max(0, week * 7 - offset)
            const day = days[index]
            const previous = days[Math.max(0, index - 7)]
            return <span key={week}>{week === 0 || day?.date.slice(0, 7) !== previous?.date.slice(0, 7)
              ? new Date(day.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) : ''}</span>
          })}</div>
          <div className="cg-days" role="group" aria-label="Daily contributions. Use arrow keys to explore." style={columnStyle}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) activate(null) }}>
            {days.map((day, index) => <button key={day.date} type="button" className="cg-cell" data-level={level(day.count)}
              style={{ gridColumn: Math.floor((index + offset) / 7) + 1, gridRow: (index + offset) % 7 + 1 }}
              tabIndex={day.date === focusDate ? 0 : -1}
              aria-label={day.date + ': ' + day.count + ' contributions'}
              title={day.date + ': ' + day.count + ' contributions'}
              onPointerEnter={() => activate(day.date)} onFocus={() => { setFocused(day.date); activate(day.date) }}
              onKeyDown={event => {
                const delta = ({ ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 } as Record<string, number>)[event.key]
                if (delta !== undefined || event.key === 'Home' || event.key === 'End') {
                  event.preventDefault()
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? days.length - 1 : Math.max(0, Math.min(days.length - 1, index + delta!))
                  ;(event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus()
                }
              }} />)}
          </div>
        </div>
      </div>
      <div className="cg-legend"><span>Less</span>{LEVELS.map(n => <i key={n} className="cg-cell" data-level={n} aria-hidden="true" />)}<span>More</span></div>
    </div>
    <div className="cg-footer" aria-live="polite" aria-atomic="true">
      <div className="cg-footer-content" key={selected?.date ?? 'best'}>
        <span>› {selected ? selected.date : 'Best day:'}</span>
        <span className="cg-chip">{(selected ?? model.best).count} contributions</span>
      </div>
      <span className="cg-rule" aria-hidden="true" />
    </div>
  </section>
}

