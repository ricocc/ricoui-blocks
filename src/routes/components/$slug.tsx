import { PropsReference } from '../../components/site/props-reference'
﻿import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { getComponentBySlug, getCategoryLabel, type ComponentMeta } from '../../data/components'
import { getSourceCode } from '../../data/source-code'
import { ComponentSource } from '../../components/site/component-source'
import { CodeBlock, CopyButton } from '../../components/site/code-block'
import { DetailInstallBar, installCommand, type PackageManager } from '../../components/site/detail-install-bar'
import { DetailShell } from '../../components/site/detail-shell'
import { SearchTrigger } from '../../components/site/global-search'
import { Icon } from '../../components/site/icon'
import { useSiteTheme } from '../../components/site/theme-toggle'
import { PreviewControls } from '../../components/site/preview-controls'
import { PreviewThemeControl } from '../../components/site/preview-theme-control'
import { PreviewLoading } from '../../components/site/preview-loading'
import { ComponentPreview } from '../../components/site/component-preview'
import { previewRegistry } from '../../data/preview-registry'
import { pageHead, site } from '../../lib/site'

export const Route = createFileRoute('/components/$slug')({
  loader: ({ params }) => {
    if (params.slug === 'ascii-empty-states') throw redirect({ to: '/components/$slug', params: { slug: 'empty-states' }, statusCode: 301 })
    const component = getComponentBySlug(params.slug)
    if (!component?.registryFile) throw notFound()
    return component
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.name, loaderData.description, '/components/' + loaderData.slug) : { meta: [{ title: 'Component not found — RicoUI Blocks' }, { name: 'robots', content: 'noindex' }] },
  component: ComponentDetailPage,
})

function ComponentDetailPage() {
  const component = Route.useLoaderData()
  return <DetailShell activeSlug={component.slug}><Detail key={component.slug} component={component} /></DetailShell>
}

const AsciiBackground = lazy(() => import('../../../registry/ascii-background').then(module => ({ default: module.AsciiBackground })))
const EmptyStatesPreview = lazy(() => import('../../components/previews/empty-states-preview'))
const KubaiEmptyStatesPreview = lazy(() => import('../../components/previews/kubai-empty-states-preview'))
const SocialCardPreview = lazy(() => import('../../components/previews/social-card-preview'))
const detailPanelSpring = { type: 'spring' as const, stiffness: 190, damping: 28, mass: 1 }

function Detail({ component }: { component: ComponentMeta }) {
  const theme = useSiteTheme()
  const isEmptyStates = component.slug === 'kubai-empty-states' || component.slug === 'empty-states'
  const isButton = component.slug === 'button' || component.slug === 'bell-button'
  const ButtonPreview = component.slug === 'bell-button' ? previewRegistry['bell-button'] : previewRegistry.button
  const [infoOpen, setInfoOpen] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [iteration, setIteration] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => { setPreviewTheme(theme) }, [theme])
  const [socialSize, setSocialSize] = useState(120)
  const [socialDirection, setSocialDirection] = useState<'left' | 'center' | 'right'>('center')
  const [socialLayout, setSocialLayout] = useState<'stack' | 'grid'>('stack')
  const [manager, setManager] = useState<PackageManager>('pnpm')
  const reduced = useReducedMotion()
  const dragControls = useDragControls()
  const infoHeading = useRef<HTMLHeadingElement>(null)
  const codeHeading = useRef<HTMLHeadingElement>(null)
  const infoTrigger = useRef<HTMLButtonElement>(null)
  const codeTrigger = useRef<HTMLButtonElement>(null)
  const configuration: Record<string, unknown> = isEmptyStates ? { theme: previewTheme }
    : isButton ? { theme: previewTheme, disabled }
    : component.slug === 'social-card' ? { size: socialSize, layout: socialLayout, direction: socialDirection }
    : component.slug === 'ascii-background' ? { theme, paused: disabled }
    : {}
  const source = getSourceCode(component.slug) || ''
  const install = installCommand(component.slug, manager)

  function resetPreview() {
    setPreviewTheme('light')
    setSocialSize(120)
    setSocialLayout('stack')
    setSocialDirection('center')
    setDisabled(false)
    setIteration(value => value + 1)
  }
  function closeCode() { setCodeOpen(false); codeTrigger.current?.focus() }
  function closeInfo() { setCodeOpen(false); setInfoOpen(false); infoTrigger.current?.focus() }
  function toggleCode() {
    if (codeOpen) closeCode()
    else { setInfoOpen(true); setCodeOpen(true) }
  }
  useEffect(() => {
    if (codeOpen) codeHeading.current?.focus({ preventScroll: true })
    else if (infoOpen) infoHeading.current?.focus({ preventScroll: true })
  }, [codeOpen, infoOpen])
  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (codeOpen) closeCode()
      else if (infoOpen) closeInfo()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [codeOpen, infoOpen])

  return <main id="main-content" className="detail-page detail-experience">
    <h1 className="sr-only">{component.name}</h1>
    <div className="detail-workspace" data-info-open={infoOpen}>
      <section className="detail-preview" data-component={component.slug} data-preview-theme={isEmptyStates || isButton ? previewTheme : undefined} aria-label={component.name + ' live preview'}>
        <div className="detail-preview-tools" role="group" aria-label="Component tools">
          <Link to="/" className="icon-button" title="Home" aria-label="Home"><Icon name="home" /></Link>
          <button ref={infoTrigger} className="icon-button" type="button" title={infoOpen ? 'Full screen preview' : 'Component information'} aria-label={infoOpen ? 'Full screen preview' : 'Component information'} aria-pressed={infoOpen} onClick={() => infoOpen ? closeInfo() : setInfoOpen(true)}><Icon name="book" /></button>
          <button ref={codeTrigger} className="icon-button" type="button" title={codeOpen ? 'Hide source code' : 'Show source code'} aria-label={codeOpen ? 'Hide source code' : 'Show source code'} aria-expanded={codeOpen} onClick={toggleCode}><Icon name={codeOpen ? 'close' : 'code'} /></button>
          <button className="icon-button" type="button" title="Reset preview" aria-label="Reset preview" onClick={resetPreview}><Icon name="reset" /></button>
          <SearchTrigger compact />
        </div>
        <div className="preview-stage"><Suspense fallback={<PreviewLoading />}><div className={'live-specimen' + (component.slug === 'ascii-background' ? ' live-specimen--background' : '') + (component.category === 'preloader' ? ' live-specimen--preloader' : '')} key={iteration}>
          {isButton ? <ButtonPreview disabled={disabled} /> : component.slug === 'empty-states' ? <EmptyStatesPreview theme={previewTheme} /> : component.slug === 'kubai-empty-states' ? <KubaiEmptyStatesPreview theme={previewTheme} /> : component.slug === 'social-card' ? <SocialCardPreview size={socialSize} layout={socialLayout} direction={socialDirection} /> : component.slug === 'ascii-background' ? <AsciiBackground theme={theme} paused={disabled} style={{ minHeight: 0 }} /> : <ComponentPreview slug={component.slug} />}
        </div></Suspense></div>
        {component.category !== 'preloader' && !['dither-progress', 'flip-switch','magnifier','file-organizer','contribution-graph'].includes(component.slug) && <PreviewControls prompt={{ component: component.name, source: component.registryFile ?? component.slug, values: configuration }} onReset={resetPreview}>
          <div className="preview-settings">
            {(isEmptyStates || isButton) && <PreviewThemeControl value={previewTheme} onChange={setPreviewTheme} />}
            {component.slug === 'social-card' && <><label>Layout<select aria-label="Layout" value={socialLayout} onChange={event => setSocialLayout(event.target.value as 'stack' | 'grid')}><option value="stack">Stack</option><option value="grid">Grid</option></select></label><label>Direction<select aria-label="Direction" value={socialDirection} onChange={event => setSocialDirection(event.target.value as 'left' | 'center' | 'right')}><option value="left">left</option><option value="center">center</option><option value="right">right</option></select></label><label>Card size <output>{socialSize}px</output><input type="range" min="64" max="240" step="4" value={socialSize} onChange={event => setSocialSize(Number(event.target.value))} /></label></>}
            {component.slug === 'ascii-background' && <label className="checkbox-label"><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Pause animation</label>}
            {component.category === 'buttons' && <label className="checkbox-label"><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Disabled</label>}
          </div>

        </PreviewControls>}
        <DetailInstallBar slug={component.slug} manager={manager} onManagerChange={setManager} />
      </section>
      <div className="detail-info-slot" inert={!infoOpen}>
        <motion.aside className="detail-info" aria-label="Component information" aria-hidden={!infoOpen} initial={false} animate={{ x: infoOpen ? 0 : reduced ? 0 : 28, opacity: infoOpen ? 1 : 0 }} transition={reduced ? { duration: 0 } : detailPanelSpring}>
          <header className="detail-info-header"><h2 ref={infoHeading} tabIndex={-1}>Component information</h2><button className="icon-button" type="button" aria-label="Close component information" onClick={closeInfo}><Icon name="close" /></button></header>
          <div className="detail-info-scroll">
            <span className="detail-info-eyebrow">{getCategoryLabel(component.category)}</span>
            <h3 className="detail-info-title">{component.name}</h3>
            <p className="detail-info-description">{component.description}</p>
            {component.interactionType && <section><h4>Interaction</h4><p>{component.interactionType}</p></section>}
            {Boolean(component.props?.length) && <section><PropsReference props={component.props!} /></section>}
            <section><h4>Installation</h4><p>Install from the registry or copy the source into your project.</p>{infoOpen && <CodeBlock code={install} language="terminal" />}</section>
            {component.usage && <section><h4>Usage</h4>{infoOpen && <CodeBlock code={component.usage} filename="example.tsx" />}</section>}
            {component.slug === 'contribution-graph' && <section><h4>GitHub data</h4><p>Install the optional server-side helper to fetch a GitHub user's contribution calendar. Keep the token in a server secret; pass the returned data and end date to the component.</p>{infoOpen && <><CodeBlock code={installCommand('github-contributions', manager)} language="terminal" /><CodeBlock filename="server.ts" code={'import { getContributions } from "@/lib/github-contributions"\n\n// On the server; env is your secret binding.\nconst { data, endDate } = await getContributions("ricocc", {\n  token: env.GITHUB_TOKEN,\n})\n\n// Render: <ContributionGraph data={data} endDate={endDate} />'} /></>}<p>The helper supports timeouts, rate-limit errors and an optional cache adapter. Private contribution visibility depends on the token and GitHub account settings.</p><p><a href={site.github + '/blob/main/docs/CONTRIBUTION-GRAPH.md'} target="_blank" rel="noreferrer">Read the complete integration guide</a></p></section>}
            <section><h4>Copy source</h4><p>Use React and Tailwind CSS 4. Save this component in your project and import its named export.</p><CopyButton text={source} label="Copy component source" /></section>
            {component.dependencies.length > 0 && <section><h4>Dependencies</h4><p>{component.dependencies.join(', ')}</p></section>}
            {!isEmptyStates && component.source.type !== 'original' && <section><h4>Credits</h4><p>{component.source.type === 'inspired' ? 'Inspired by ' : 'Based on '}<a href={component.source.url} target="_blank" rel="noreferrer">{component.source.name}</a>{component.source.author && ' by ' + component.source.author}</p>{component.source.type === 'based-on' && <p>License: {component.source.license}</p>}</section>}
            <a className="text-link detail-info-source" href={site.github + '/blob/main/' + component.registryFile} target="_blank" rel="noreferrer"><Icon name="github" /> View on GitHub<Icon name="external" size={14} /></a>
            {component.slug === 'kubai-empty-states' && <section><h4>Credits</h4><p>Inspired by <a href="https://x.com/Kubai087" target="_blank" rel="noreferrer">{'\u67af\u767d\u5543\u8bbe\u8ba1'}</a> ? <a href="https://lumno.kubai.design/" target="_blank" rel="noreferrer">lumno.kubai.design</a></p><p>Icons by <a href="https://github.com/Remix-Design/RemixIcon/tree/v4.6.0" target="_blank" rel="noreferrer">Remix Icon</a></p></section>}
          </div>
          <AnimatePresence initial={false}>{codeOpen && <motion.div className="detail-code-drawer" drag="y" dragListener={false} dragControls={dragControls} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .35 }} onDragEnd={(_, info) => { if (info.offset.y > 100) closeCode() }} initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }} transition={reduced ? { duration: 0 } : detailPanelSpring}>
            <ComponentSource slug={component.slug} filename={component.registryFile} title={component.name + ' source'} headingRef={codeHeading} onClose={closeCode} onDragStart={event => dragControls.start(event)} />
          </motion.div>}</AnimatePresence>
        </motion.aside>
      </div>
    </div>
  </main>
}
