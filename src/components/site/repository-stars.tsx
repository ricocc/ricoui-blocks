import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

type StarCount = { count: number; expires: number }
const validCount = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0

export function RepositoryStars({ repository }: { repository: string }) {
  const [result, setResult] = useState<{ repository: string; count: number | null; loading: boolean }>({ repository, count: null, loading: true })
  const current = result.repository === repository ? result : { count: null, loading: true }

  useEffect(() => {
    const key = 'ricoui-github-stars:' + repository
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null') as StarCount | null
      if (cached && validCount(cached.count) && cached.expires > Date.now()) {
        setResult({ repository, count: cached.count, loading: false })
        return
      }
    } catch { /* The count can still load when storage is unavailable. */ }

    const controller = new AbortController()
    let disposed = false
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    fetch('https://api.github.com/repos/' + repository, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    }).then(response => response.ok ? response.json() : null).then(data => {
      if (disposed) return
      const count = validCount(data?.stargazers_count) ? data.stargazers_count : null
      setResult({ repository, count, loading: false })
      if (count !== null) {
        try { sessionStorage.setItem(key, JSON.stringify({ count, expires: Date.now() + 600_000 })) } catch { /* Optional cache. */ }
      }
    }).catch(() => {
      if (!disposed) setResult({ repository, count: null, loading: false })
    }).finally(() => clearTimeout(timeout))
    return () => { disposed = true; clearTimeout(timeout); controller.abort() }
  }, [repository])

  const label = current.count === null ? 'View repository on GitHub' : current.count.toLocaleString('en') + ' GitHub stars'
  return <a className="template-stars" href={'https://github.com/' + repository} target="_blank" rel="noreferrer" aria-label={label} title={label}>
    <Star size={14} strokeWidth={1.6} aria-hidden="true" />
    <span>{current.count === null ? current.loading ? '—' : 'GitHub' : current.count.toLocaleString('en')}</span>
  </a>
}
