import { HomeHero } from './home-hero'
import { HomeShowcase } from './home-showcase'
import { HomeDiscovery } from './home-discovery'
import { HomeProcess } from './home-process'
import { HomeFaq } from './home-faq'
import { HomeNight } from './home-night'
import { SiteFooter } from '../site-footer'
import './home.css'

export function HomePage() {
  return (
    <>
      <main id="main-content" className="collection-home home-sheet">
        <HomeHero />
        <HomeShowcase />
        <HomeDiscovery />
        {/* <HomeProcess /> */}
        <HomeFaq />
        <HomeNight />
      </main>
      <SiteFooter />
    </>
  )
}
