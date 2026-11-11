import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DitherProgress } from '../../../registry/dither-progress'
import { PreviewControls } from '../site/preview-controls'
import { PreviewThemeControl } from '../site/preview-theme-control'

export default function DitherProgressPreview() {
  const [value, setValue] = useState(75)
  const [playing, setPlaying] = useState(false)
  const [animated, setAnimated] = useState(true)
  const [size, setSize] = useState(480)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [baseColor, setBaseColor] = useState('#1756ff')
  const [fillColor, setFillColor] = useState('#ff782b')
  const [highlightColor, setHighlightColor] = useState('#ffd528')
  const root = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<HTMLElement | null>(null)
  useEffect(() => { setPreview(root.current?.closest<HTMLElement>('.detail-preview') ?? null) }, [])
  useEffect(() => { if (!preview) return; preview.dataset.previewTheme = theme; return () => { delete preview.dataset.previewTheme } }, [preview, theme])
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setValue(current => Math.min(100, current + 5)), 500)
    return () => clearInterval(timer)
  }, [playing])
  useEffect(() => { if (value === 100) setPlaying(false) }, [value])
  function reset() { setPlaying(false); setValue(75); setAnimated(true); setSize(480); setTheme('light'); setBaseColor('#1756ff'); setFillColor('#ff782b'); setHighlightColor('#ffd528') }
  return <div ref={root} className="dither-progress-preview">
    <DitherProgress value={value} animated={animated} size={size} baseColor={baseColor} fillColor={fillColor} highlightColor={highlightColor} aria-label="Demo progress" />
    <div className="dp-demo-actions" aria-label="Progress demo">
      <button type="button" onClick={() => { if (value === 100) setValue(0); setPlaying(!playing) }}>{playing ? 'Pause' : value === 100 ? 'Replay' : 'Play'}</button>
      <span aria-hidden="true" />
      {[0, 25, 50, 75, 100].map(step => <button key={step} type="button" aria-pressed={value === step} onClick={() => { setPlaying(false); setValue(step) }}>{step}%</button>)}
    </div>
    {preview && createPortal(<PreviewControls onReset={reset} prompt={{ component: 'DitherProgress', source: 'registry/dither-progress.tsx', values: { value, size, animated, baseColor, fillColor, highlightColor }, notes: 'Pass real progress from 0 to 100. Demo playback and preview theme are website-only.' }}>
      <div className="preview-settings">
        <PreviewThemeControl value={theme} onChange={setTheme} />
        <label>Progress <output>{value}%</output><input aria-label="Progress" type="range" min="0" max="100" value={value} onChange={event => { setPlaying(false); setValue(Number(event.target.value)) }} /></label>
        <label>Size<select value={size} onChange={event => setSize(Number(event.target.value))}><option value={320}>Small</option><option value={480}>Medium</option><option value={620}>Large</option></select></label>
        <label className="checkbox-label"><input type="checkbox" checked={animated} onChange={event => setAnimated(event.target.checked)} />Animate progress</label>
        <label>Housing<input type="color" value={baseColor} onChange={event => setBaseColor(event.target.value)} /></label>
        <label>Fill<input type="color" value={fillColor} onChange={event => setFillColor(event.target.value)} /></label>
        <label>Highlight<input type="color" value={highlightColor} onChange={event => setHighlightColor(event.target.value)} /></label>
      </div>
    </PreviewControls>, preview)}
  </div>
}
