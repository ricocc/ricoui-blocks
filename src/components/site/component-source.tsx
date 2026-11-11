import { useId, useState, type PointerEventHandler, type Ref } from 'react'
import { getHtmlSourceCode, getSourceCode } from '../../data/source-code'
import { CodeBlock, CopyButton, DownloadButton } from './code-block'
import { Icon } from './icon'

export function ComponentSource({
  slug,
  filename,
  title = 'Source code',
  headingRef,
  onClose,
  onDragStart,
}: {
  slug: string
  filename?: string
  title?: string
  headingRef?: Ref<HTMLHeadingElement>
  onClose?: () => void
  onDragStart?: PointerEventHandler<HTMLDivElement>
}) {
  const [version, setVersion] = useState<'react' | 'html'>('react')
  const id = useId()
  const html = getHtmlSourceCode(slug)
  const versions = html ? (['react', 'html'] as const) : (['react'] as const)
  const code = version === 'html' && html ? html : getSourceCode(slug) || ''
  const language = version === 'html' ? 'html' : 'tsx'
  const activeFilename = version === 'html' ? slug + '.html' : filename || slug + '.tsx'

  return <div className="component-source">
    <div className="source-toolbar" onPointerDown={event => {
      if (!(event.target as HTMLElement).closest('button')) onDragStart?.(event)
    }}>
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">{title}</h2>
      <div className="source-tabs" role="tablist" aria-label="Source version">
        {versions.map((item, index) => <button
          key={item}
          id={id + '-' + item}
          type="button"
          role="tab"
          aria-selected={version === item}
          aria-controls={id + '-panel'}
          tabIndex={version === item ? 0 : -1}
          onClick={() => setVersion(item)}
          onKeyDown={event => {
            let next = index
            if (event.key === 'ArrowRight') next = (index + 1) % versions.length
            else if (event.key === 'ArrowLeft') next = (index + versions.length - 1) % versions.length
            else if (event.key === 'Home') next = 0
            else if (event.key === 'End') next = versions.length - 1
            else return
            event.preventDefault()
            setVersion(versions[next])
            document.getElementById(id + '-' + versions[next])?.focus()
          }}
        >{item === 'react' ? 'React' : 'HTML'}</button>)}
      </div>
      <div className="source-actions">
        <CopyButton text={code} iconOnly />
        <DownloadButton code={code} filename={activeFilename} language={language} />
        {onClose && <button type="button" className="copy-button" title="Close source code" aria-label="Close source code" onClick={onClose}><Icon name="close" size={14} /></button>}
      </div>
    </div>
    <div id={id + '-panel'} role="tabpanel" aria-labelledby={id + '-' + version} className="source-panel">
      <CodeBlock key={version} code={code} language={language} filename={activeFilename} hideHeader />
    </div>
  </div>
}
