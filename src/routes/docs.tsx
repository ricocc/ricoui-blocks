import { useEffect, useState } from 'react'
import { CodeBlock } from '../components/site/code-block'
import '../components/site/docs.css'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Icon } from '../components/site/icon'
import { pageHead, site } from '../lib/site'
import { siteLinks } from '../data/site-navigation'

export const Route = createFileRoute('/docs')({ head: () => pageHead('Documentation', 'Install, customize, and use RicoUI components in your React and Tailwind projects.', '/docs'), component: DocsPage })

const sections = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'installation', label: 'Install with the CLI' },
  { id: 'copy-source', label: 'Copy source' },
  { id: 'usage', label: 'Use the component' },
  { id: 'customization', label: 'Customization' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'license', label: 'License' },
] as const

function DocsPage() {
  const [active, setActive] = useState<string>('getting-started')
  useEffect(() => {
    let frame = 0
    const update = () => {
      let current: string = sections[0].id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= 160) current = section.id
      }
      setActive(current)
    }
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll) }
  }, [])
  return <main id="main-content" className="docs-page docs-guide">
    <header className="docs-heading"><div><h1>Build with RicoUI.</h1><p>Add a component to your React project, try it, and customize the source.</p></div><Link to="/browse" className="button primary">Browse components <Icon name="arrow" size={16} /></Link></header>
    <div className="docs-layout"><nav className="docs-nav" aria-label="Documentation sections"><span className="docs-nav-title">On this page</span>{sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>{section.label}</a>)}<a href={site.github} target="_blank" rel="noreferrer">GitHub <Icon name="external" size={14} /></a></nav>
      <div className="docs-content">
        <section id="getting-started"><h2>Getting started</h2><p>Choose a component in Browse and try its live preview. Open Component information for its props, usage example, and any extra dependencies. Use Show source code to read the implementation.</p><div className="docs-callout"><strong>Before you start</strong><p>You need a React project with Tailwind CSS 4 configured. RicoUI components are source files you add to that project and edit directly.</p></div><div className="docs-methods"><a href="#installation"><strong>Install with the CLI</strong><p>Add the component and its dependencies with the shadcn CLI.</p><Icon name="arrow" size={16} /></a><a href="#copy-source"><strong>Copy the source</strong><p>Save the files yourself and install any listed dependencies.</p><Icon name="arrow" size={16} /></a></div></section>
        <section id="installation"><h2>Install with the CLI</h2><p>Choose your package manager in the install bar below the component preview. Copy the command and run it from your project folder. For example:</p><CodeBlock language="bash" filename="Terminal" code={`npx shadcn@latest add ${site.url}/r/flip-switch.json`} /><p>The shadcn CLI adds the component source and its declared dependencies. You do not need to use shadcn/ui components.</p><p>Once installed, <a href="#usage">import and render the component</a> in your project.</p></section>
        <section id="copy-source"><h2>Copy source</h2><p>On a component page, choose Show source code and copy the full source. Save it as a <code>.tsx</code> file in your project, such as <code>src/components/ui/flip-switch.tsx</code>.</p><p>If the component lists extra packages under Dependencies in Component information, install them with your package manager. Then <a href="#usage">import and render the component</a>.</p></section>
        <section id="usage"><h2>Use the component</h2><p>After installing with the CLI or copying the source, import the component into a page or another component:</p><CodeBlock filename="example.tsx" code={`import { FlipSwitch } from "@/components/ui/flip-switch"

export function Example() {
  return <FlipSwitch aria-label="Enable notifications" />
}`} /><p>Adjust the import path to match the file’s location. The <code>@/</code> alias is only an example; a relative path works too. Each component’s Usage section shows its named export and example props.</p></section>
        <section id="customization"><h2>Customization</h2><p>Check Props in the Component information panel for the available options. Use <code>className</code> where supported, or edit the source to change colors, motion, and markup.</p><p>Customize controls only change the live preview. Apply the settings you like as props or styles in your project; copied and installed source keeps the component’s defaults.</p><p>The website’s theme switch changes the site, not every component preview. Some components keep a fixed palette or background, so check their props and source when adapting them to your theme.</p></section>
        <section id="accessibility"><h2>Accessibility</h2><p>When adapting a component, keep button and link labels clear and keyboard focus visible. Check that the interaction still works with a keyboard and on touch devices.</p><p>If you change the animation, preserve its reduced-motion handling and try it with reduced motion enabled on your device.</p><div className="docs-end-link"><Link to="/browse">Browse components <Icon name="arrow" size={16} /></Link><a href={site.github} target="_blank" rel="noreferrer">View on GitHub <Icon name="external" size={16} /></a></div></section>
        <section id="license"><h2>License</h2><p>RicoUI’s own code is available under the <a href={siteLinks.license} target="_blank" rel="noreferrer">MIT License</a>. You can use and modify it in personal and commercial projects. Include the copyright and license notice with copies or substantial portions of the code.</p><p>Third-party code, fonts, and other assets retain their own licenses and notices. The website’s TechText and PixelReveal effects use a separate license with additional restrictions; it is preserved alongside their source. Templates are separate projects, so check the license in each template’s repository.</p></section>
      </div>
    </div>
  </main>
}
