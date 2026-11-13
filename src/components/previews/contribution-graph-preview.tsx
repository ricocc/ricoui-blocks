import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { PreviewControls } from '../site/preview-controls'
import { ContributionGraph } from '../../../registry/contribution-graph'

// Preview-only data: one 25-day streak and a 13-day streak ending on the last day.
const data = Array.from({ length: 365 }, (_, i) => {
  let count = Math.sin(i * 12.31) > .2 ? Math.floor((Math.sin(i * 7.19) + 1) * 12) : 0
  if ((i >= 120 && i < 145) || i >= 352) count = Math.max(1, count)
  if (i === 119 || i === 145 || i === 351) count = 0
  return {
    date: new Date(Date.UTC(2025, 10, 4) + i * 86400000).toISOString().slice(0, 10),
    count,
  }
})

const palettes = [
  { name: '蓝色', ink: '#2d6dc3' },
  { name: '黑色', ink: '#24282d' },
  { name: '绿色', ink: '#23845b' },
  { name: '白色', ink: '#f3f5f8' },
  { name: '橙色', ink: '#bd601c' },
  { name: '紫色', ink: '#8055bd' },
]

export default function ContributionGraphPreview() {
  const [selected, setSelected] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<HTMLElement | null>(null)
  useEffect(() => { setPreview(rootRef.current?.closest<HTMLElement>('.detail-preview') ?? null) }, [])
  const palette = palettes[selected]
  const dark = selected === 3
  // Preview-only overrides; neither these controls nor palettes enter the Registry source.
  const colors = selected === 0 ? undefined : {
    '--brand': palette.ink,
    '--foreground': dark ? '#f3f5f8' : '#25303b',
    '--foreground-muted': dark ? '#aeb8c5' : '#637080',
    '--surface': dark ? '#20252d' : '#ffffff',
    '--surface-subtle': dark ? '#303741' : '#f1f3f6',
    '--border': dark ? '#657080' : '#c5cdd6',
  } as CSSProperties

  return <div ref={rootRef} className="cg-preview" style={{ width: '100%', maxWidth: 880, marginInline: 'auto' }}>
    <style>{`
      .cg-preview>section{transition:background-color .25s,color .25s,border-color .25s}
      .cg-palette{display:flex;align-items:center;gap:3px;padding:0 4px 0 2px}
      .cg-palette button{display:grid;place-items:center;flex:none;width:30px;height:34px;padding:0;border:0;border-radius:5px;background:transparent;cursor:pointer}
      .cg-palette button:hover{background:var(--surface-subtle)}
      .cg-palette button:focus-visible{outline:2px solid var(--brand);outline-offset:-2px}
      .cg-palette button span{width:18px;height:18px;border-radius:50%;background:var(--swatch);border:1px solid var(--border);outline:1px solid transparent;outline-offset:2px}
      .cg-palette button[aria-checked="true"] span{outline-color:var(--foreground-muted)}
      @media(max-width:500px){.cg-palette{gap:0;padding:0 2px}.cg-palette button{width:25px;height:32px}.cg-palette button span{width:16px;height:16px}}
      @media(prefers-reduced-motion:reduce){.cg-preview>section{transition:none}}
    `}</style>
    <ContributionGraph data={data} endDate="2026-11-03" style={colors} />
    {preview && createPortal(<PreviewControls prompt={{ component: 'ContributionGraph', slug: 'contribution-graph', values: { style: colors ?? {} }, notes: selected === 0 ? 'Remove palette overrides from `style` to restore the default colors.' : 'Merge the palette variables into the existing `style`.' }} onReset={() => setSelected(0)}><div className="cg-palette" role="radiogroup" aria-label="预览配色">
      {palettes.map((item, index) => <button key={item.name} type="button" role="radio"
        aria-label={item.name} aria-checked={selected === index} title={item.name}
        tabIndex={selected === index ? 0 : -1} style={{ '--swatch': item.ink } as CSSProperties}
        onClick={() => setSelected(index)}
        onKeyDown={event => {
          let next: number
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % palettes.length
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + palettes.length - 1) % palettes.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = palettes.length - 1
          else return
          event.preventDefault()
          setSelected(next)
          event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
        }}><span /></button>)}
    </div></PreviewControls>, preview)}
  </div>
}
