import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GithubRepo } from '../../../registry/github-repo'
import { PreviewControls } from '../site/preview-controls'

const defaults = {
  owner: 'ricocc',
  name: 'ricoui-blocks',
  description: 'RICOUI - Animated React components、blocks、Templates.',
  visibility: 'Public',
  stars: 274,
  forks: 39,
  starsLabel: 'stars',
  forksLabel: 'forks',
}

export default function GithubRepoPreview() {
  const [values, setValues] = useState(defaults)
  function updateText(field: 'owner' | 'name' | 'description' | 'visibility' | 'starsLabel' | 'forksLabel', value: string) {
    setValues(previous => ({ ...previous, [field]: value }))
  }
  function updateCount(field: 'stars' | 'forks', value: string) {
    const count = Math.max(0, Number(value))
    setValues(previous => ({ ...previous, [field]: count }))
  }
  const root = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPreview(root.current?.closest<HTMLElement>('.detail-preview') ?? null)
  }, [])

  return <div ref={root} className="mx-auto w-full max-w-[620px] p-3">
    <GithubRepo {...values} />
    {preview && createPortal(
      <PreviewControls prompt={{ component: 'GithubRepo', slug: 'github-repo', values }} onReset={() => setValues(defaults)}>
        <div className="preview-settings">
          <label>Owner<input value={values.owner} onInput={event => updateText('owner', event.currentTarget.value)} /></label>
          <label>Repository<input value={values.name} onInput={event => updateText('name', event.currentTarget.value)} /></label>
          <label>Description<textarea rows={3} value={values.description} onInput={event => updateText('description', event.currentTarget.value)} /></label>
          <label>Visibility label<input value={values.visibility} onInput={event => updateText('visibility', event.currentTarget.value)} /></label>
          <label>Stars<input type="number" min="0" step="1" value={values.stars} onInput={event => updateCount('stars', event.currentTarget.value)} /></label>
          <label>Stars caption<input value={values.starsLabel} onInput={event => updateText('starsLabel', event.currentTarget.value)} /></label>
          <label>Forks<input type="number" min="0" step="1" value={values.forks} onInput={event => updateCount('forks', event.currentTarget.value)} /></label>
          <label>Forks caption<input value={values.forksLabel} onInput={event => updateText('forksLabel', event.currentTarget.value)} /></label>
        </div>
      </PreviewControls>, preview)}
  </div>
}
