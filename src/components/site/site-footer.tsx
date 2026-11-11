import { Link } from '@tanstack/react-router'
import { footerConnect, footerCopy, footerExplore, footerLegal, siteLinks } from '../../data/site-navigation'
import { Icon } from './icon'
import TechText from './tech-text'
import './site-footer.css'

export function SiteFooter() {
  return (
    <footer className="brand-footer" aria-label="Site footer">
      <div className="brand-footer-directory">
        <div className="brand-footer-identity">
          <Link to={siteLinks.home} className="brand-footer-brand" aria-label="RicoUI home"><img src="/logo-style.png" width={36} height={36} alt="" />RicoUI</Link>
          <p>{footerCopy.description[0]}<br />{footerCopy.description[1]}</p>
          <a className="brand-footer-credit" href={siteLinks.author} target="_blank" rel="noreferrer">{footerCopy.authorCredit} <Icon name="external" size={12} /></a>
        </div>
        <nav className="brand-footer-group" aria-labelledby="footer-explore"><h2 id="footer-explore">{footerCopy.sectionHeadings.explore}</h2>{footerExplore.map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}</nav>
        <nav className="brand-footer-group" aria-labelledby="footer-connect"><h2 id="footer-connect">{footerCopy.sectionHeadings.connect}</h2>{footerConnect.map(item => <a key={item.label} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>{item.label}{item.external && <Icon name="external" size={12} />}</a>)}</nav>
        <nav className="brand-footer-group" aria-labelledby="footer-legal"><h2 id="footer-legal">{footerCopy.sectionHeadings.legal}</h2>{footerLegal.map(item => 'to' in item ? <Link key={item.label} to={item.to}>{item.label}</Link> : <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</nav>
      </div>
      <div className="brand-footer-wordmark">
        <span className="sr-only">{footerCopy.wordmark}</span>
        <TechText text={footerCopy.wordmark} fontWeight={600} fontSize={150} letterSpacing={-.04} reveal="letter" dashLength={2} dashGap={2} specks={32} strokeWidth={1.5} speed={.9} draggable />
      </div>
      <div className="brand-footer-bottom">
        <p>{footerCopy.copyright}</p>
        <a href="#main-content">{footerCopy.backToTop} <span aria-hidden="true">↑</span></a>
      </div></footer>
  )
}
