import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './theme-toggle'
import { SearchTrigger } from './global-search'
import { GitHubStars } from './github-stars'
import { headerNavigation, siteLinks } from '../../data/site-navigation'

function BrandSymbol() {
  return <img className="brand-symbol" src="/logo.png" width={32} height={32} alt="" />
}

export function Header() {
  const path = useRouterState({ select: state => state.location.pathname })
  const floating = path !== '/home'
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (!floating || path === '/browse') {
      setScrolled(false)
      return
    }
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [path, floating])
  return <header className={floating ? 'site-header floating-header' : 'site-header'} data-surface={path === '/browse' || scrolled}><div className="header-inner">
    <Link to={siteLinks.home} className="wordmark" aria-label="RicoUI Blocks home">{path === '/home' ? <span className="brand-mark">r.</span> : <BrandSymbol />}<span className="wordmark-name">Rico<span>UI</span></span><span className="brand-tag">Blocks</span></Link>
    <nav aria-label="Primary navigation" className="header-nav">{headerNavigation.map(item => <Link key={item.to} to={item.to} activeProps={{ className: 'nav-active' }} activeOptions={{ exact: item.to === '/' }}>{item.label}</Link>)}</nav>
    <div className="header-social"><SearchTrigger compact /><GitHubStars /><ThemeToggle /></div>
  </div></header>
}
