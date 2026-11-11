import { Link } from '@tanstack/react-router'
import { compactFooterNavigation, footerCopy, siteLinks } from '../../data/site-navigation'
import { Icon } from './icon'
export function Footer() {
  return <footer className="site-footer"><div><Link to={siteLinks.home} className="footer-brand" aria-label="RicoUI home"><img src="/logo-style-1.png" width={32} height={32} alt="" />RicoUI</Link><p>{footerCopy.compactDescription}</p></div><nav aria-label="Footer navigation">{compactFooterNavigation.map(item => 'to' in item ? <Link key={item.label} to={item.to}>{item.label}</Link> : <a key={item.label} href={item.href} target={'external' in item && item.external ? '_blank' : undefined} rel={'external' in item && item.external ? 'noreferrer' : undefined}>{item.label}</a>)}<a className="icon-button" href={siteLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub repository" title="GitHub"><Icon name="github" size={22} /></a></nav><a className="footer-credit" href={siteLinks.author} target="_blank" rel="noreferrer">{footerCopy.compactAuthorCredit} <strong>RICOUI</strong><Icon name="external" size={14} /></a></footer>
}
