import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { site } from '../../lib/site'
import { Icon } from './icon'

const repository = new URL(site.github).pathname.replace(/^\//, '')

export function GitHubStars() {
  const path = useRouterState({ select: state => state.location.pathname })
  const [result, setResult] = useState<{ path: string; count: number } | null>(null)
  const stars = result?.path === path ? result.count : null

  useEffect(() => {
    setResult(null)
    const controller = new AbortController()
    let disposed = false
    fetch(`https://api.github.com/repos/${repository}`, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
      signal: controller.signal,
    }).then(response => response.ok ? response.json() : null)
      .then(data => {
        const count: unknown = data?.stargazers_count
        if (disposed || typeof count !== 'number' || !Number.isInteger(count) || count < 0) return
        setResult({ path, count })
      }).catch(() => {})
    return () => { disposed = true; controller.abort() }
  }, [path])

  return <a className="github-stars" href={site.github} target="_blank" rel="noreferrer" aria-label={stars === null ? 'View RicoUI on GitHub' : `View RicoUI on GitHub, ${stars.toLocaleString('en')} stars`} title={stars === null ? 'GitHub' : `${stars.toLocaleString('en')} GitHub stars`}>
    <Icon name="github" size={20} />
    {stars !== null && <span className="github-stars-count">{stars.toLocaleString('en')}</span>}
  </a>
}
