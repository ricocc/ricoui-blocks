import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileOrganizer, type FileOrganizerItem } from '../../../registry/file-organizer'
import { PreviewControls } from '../site/preview-controls'

export default function FileOrganizerPreview() {
  const [interactionMode, setInteractionMode] = useState<'all' | 'single'>('all')
  const [revision, setRevision] = useState(0)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('Projects')
  const [labels, setLabels] = useState(['Roadmap', 'Guidelines', 'Launch Plan'])
  const items: FileOrganizerItem[] = labels.map((text, i) => ({ id: ['roadmap', 'brand', 'launch'][i], title: text, color: (['white', 'orange', 'yellow'] as const)[i] }))
  const root = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<HTMLElement | null>(null)
  useEffect(() => { setPreview(root.current?.closest<HTMLElement>('.detail-preview') ?? null) }, [])
  return <div ref={root} className="mx-auto w-full max-w-[540px]">
    <FileOrganizer key={revision} items={items} title={title} interactionMode={interactionMode} open={open} onOpenChange={setOpen} />
    {preview && createPortal(<PreviewControls prompt={{ component: 'FileOrganizer', slug: 'file-organizer', values: { title, items, interactionMode, defaultOpen: open }, notes: 'For controlled usage, set `open` via its existing state.' }} onReset={() => { setRevision(value => value + 1); setOpen(false); setInteractionMode('all'); setTitle('Projects'); setLabels(['Roadmap', 'Guidelines', 'Launch Plan']) }}>
      <div className="preview-settings">
        <label>Click behavior<select aria-label="Click behavior" value={interactionMode} onChange={event=>{setInteractionMode(event.target.value as 'all' | 'single');setOpen(false)}}><option value="all">All folders</option><option value="single">Single folder</option></select></label>
        <label>Back folder<input value={title} maxLength={40} onChange={event => setTitle(event.target.value)} /></label>
        {labels.map((text, index) => <label key={index}>{['White folder', 'Orange folder', 'Yellow folder'][index]}<input value={text} maxLength={60} onChange={event => setLabels(previous => previous.map((label, i) => i === index ? event.target.value : label))} /></label>)}
        {interactionMode === 'all' && <label className="checkbox-label"><input type="checkbox" checked={open} onChange={event => setOpen(event.target.checked)} /> Expand all folders</label>}
      </div>

    </PreviewControls>, preview)}
  </div>
}
