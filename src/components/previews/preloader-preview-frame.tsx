import { RotateCcw } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

export const preloaderPreviewImages = Array.from({ length: 7 }, (_, i) => `/images/preloader/${String(i + 1).padStart(3, '0')}.jpg`)

/** Website-only demo progress and replay; never distributed with the components. */
export function PreloaderPreviewFrame({ children, duration = 3000, images = [] }: {
  children: (props: { progress: number; onComplete: () => void }) => ReactNode
  duration?: number
  images?: string[]
}) {
  const [cycle, setCycle] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const imageKey = JSON.stringify(images)
  useEffect(() => {
    let cancelled = false
    let loaded = images.length === 0
    const disposers: (() => void)[] = []
    if (images.length) Promise.all(images.map(src => new Promise<void>(resolve => {
      const img = new Image()
      img.onload = img.onerror = () => resolve()
      img.src = src
      disposers.push(() => { img.onload = img.onerror = null })
    }))).then(() => { if (!cancelled) loaded = true })
    const start = performance.now()
    const timer = window.setInterval(() => {
      const value = Math.min(loaded ? 100 : 95, (performance.now() - start) / duration * 100)
      setProgress(value)
      if (value === 100) window.clearInterval(timer)
    }, 100)
    return () => { cancelled = true; clearInterval(timer); disposers.forEach(dispose => dispose()) }
  }, [cycle, duration, imageKey])
  function replay() { setProgress(0); setDone(false); setCycle(value => value + 1) }
  return <div className="relative h-full min-h-64 w-full overflow-hidden bg-[var(--surface-subtle)]">
    <div key={cycle} className="absolute inset-0">{children({ progress, onComplete: () => setDone(true) })}</div>
    {done && <div className="absolute inset-0 flex items-center justify-center"><button type="button" onClick={replay} aria-label="Replay animation" title="Replay animation" className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-4"><RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" /></button></div>}
  </div>
}
