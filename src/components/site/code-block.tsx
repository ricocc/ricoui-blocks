import { useEffect, useRef, useState } from 'react'
import { Icon } from './icon'
import type { ThemedToken } from 'shiki'
import type { CSSProperties } from 'react'

type ActionStatus = 'idle' | 'pending' | 'success' | 'error'

function useActionFeedback(value: string) {
  const [status, setStatus] = useState<ActionStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const request = useRef(0)
  const pending = useRef(false)
  useEffect(() => {
    setStatus('idle')
    pending.current = false
    return () => {
      request.current++
      pending.current = false
      clearTimeout(timer.current)
    }
  }, [value])

  async function run(action: () => boolean | Promise<boolean>) {
    if (pending.current) return
    const current = ++request.current
    pending.current = true
    clearTimeout(timer.current)
    setStatus('pending')
    let succeeded = false
    try { succeeded = await action() } catch { /* Report failure on the action itself. */ }
    if (current !== request.current) return
    pending.current = false
    setStatus(succeeded ? 'success' : 'error')
    timer.current = setTimeout(() => setStatus('idle'), succeeded ? 2000 : 4000)
  }
  return { status, run }
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch { /* Try the selection-based fallback for restricted clipboard contexts. */ }
  }

  const focused = document.activeElement
  const selection = document.getSelection()
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : []
  const field = document.createElement('textarea')
  field.value = text
  field.readOnly = true
  field.tabIndex = -1
  field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;font-size:16px;'
  document.body.appendChild(field)
  try {
    field.focus({ preventScroll: true })
    field.select()
    return document.execCommand('copy')
  } finally {
    field.remove()
    if (focused instanceof HTMLElement) focused.focus({ preventScroll: true })
    if (selection && ranges.length) {
      selection.removeAllRanges()
      ranges.forEach(range => selection.addRange(range))
    }
  }
}

export function CopyButton({ text, label = 'Copy code', iconOnly = false, buttonLabel = 'Copy', captureOnPointerDown = false }: { text: string; label?: string; iconOnly?: boolean; buttonLabel?: string; captureOnPointerDown?: boolean }) {
  const capturedText = useRef<string | null>(null)
  const { status, run } = useActionFeedback(text)
  const message = status === 'success' ? 'Copied to clipboard.' : status === 'error' ? 'Copy failed. Try again or select the code to copy manually.' : status === 'pending' ? 'Copying to clipboard…' : label
  const icon = status === 'success' ? 'check' : status === 'error' ? 'alert' : 'copy'

  return <span className="copy-action">
    <button type="button" className="copy-button" data-state={status} data-icon-only={iconOnly} onPointerDown={() => { if (captureOnPointerDown) capturedText.current = text }} onKeyDown={() => { capturedText.current = null }} onClick={() => { const value = capturedText.current ?? text; capturedText.current = null; run(() => copyToClipboard(value)) }} aria-label={message} title={message} aria-busy={status === 'pending'} aria-disabled={status === 'pending'}>
      <span className="copy-button-icon"><Icon name={icon} size={14} /></span>
      {!iconOnly && <span className="copy-button-label" aria-hidden="true">{status === 'success' ? 'Copied' : status === 'error' ? 'Retry' : buttonLabel}</span>}
    </button>
    <span className="sr-only" role="status" aria-atomic="true">{status === 'success' || status === 'error' ? message : ''}</span>
  </span>
}

export function DownloadButton({ code, filename, language }: { code: string; filename: string; language: string }) {
  const { status, run } = useActionFeedback(filename + ':' + code)
  const message = status === 'success' ? 'Download started.' : status === 'error' ? 'Download could not start. Try again.' : 'Download source'
  function download() {
    const url = URL.createObjectURL(new Blob([code], {
      type: language === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8',
    }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename.split('/').pop() || filename
    try {
      document.body.appendChild(link)
      link.click()
      return true
    } finally {
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }
  return <span className="copy-action">
    <button type="button" className="copy-button" data-state={status} data-icon-only="true" title={message} aria-label={message} aria-busy={status === 'pending'} aria-disabled={status === 'pending'} onClick={() => run(download)}>
      <span className="copy-button-icon"><Icon name={status === 'success' ? 'check' : status === 'error' ? 'alert' : 'download'} size={14} /></span>
    </button>
    <span className="sr-only" role="status" aria-atomic="true">{status === 'success' || status === 'error' ? message : ''}</span>
  </span>
}

export function CodeBlock({ code, language = 'tsx', filename, hideHeader = false }: { code: string; language?: string; filename?: string; hideHeader?: boolean }) {
  const [highlight, setHighlight] = useState<{ code: string; tokens: ThemedToken[][] } | null>(null)
  useEffect(() => {
    let cancelled = false
    import('../../lib/highlight-code').then(m => m.highlightCode(code, language)).then(tokens => {
      if (!cancelled) setHighlight({ code, tokens })
    }).catch(() => { if (!cancelled) setHighlight(null) })
    return () => { cancelled = true }
  }, [code, language])
  const tokens = highlight?.code === code ? highlight.tokens : null
  return <div className="code-block">{!hideHeader && <div className="code-header"><span><Icon name="code" size={16} />{filename || language}</span><CopyButton text={code} iconOnly /></div>}<pre tabIndex={0} aria-label={filename || language + ' code'}><code>{code.split('\n').map((line,i) => <span className="code-line" key={i}><span className="line-number" aria-hidden="true">{i+1}</span>{tokens?.[i] ? tokens[i].map((token,j) => <span key={j} className="syntax-token" style={{ color: token.color, ...token.htmlStyle } as CSSProperties}>{token.content}</span>) : <span>{line || ' '}</span>}</span>)}</code></pre></div>
}
