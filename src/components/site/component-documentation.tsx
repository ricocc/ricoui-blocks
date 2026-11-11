import { PropsReference } from './props-reference'
import type { ComponentMeta } from '../../data/components'
import { getSourceCode } from '../../data/source-code'
import { ComponentSource } from './component-source'
import { CodeBlock } from './code-block'

type ComponentDocumentationProps = {
  component: ComponentMeta
}

export function ComponentDocumentation({
  component,
}: ComponentDocumentationProps) {
  const sourceCode = component.registryFile ? getSourceCode(component.slug) : undefined

  return (
    <article className="max-w-xl">
      <p className="text-sm text-[var(--foreground-faint)]">{component.category}</p>
      <h1 className="mt-3 text-balance text-4xl font-medium tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
        {component.name}
      </h1>
      <p className="mt-5 text-[1.05rem] leading-8 text-[var(--foreground-muted)]">
        {component.description}
      </p>

      <div className="mt-10 space-y-10 border-t border-[var(--border-subtle)] pt-8">
        <DocumentationSection title="Dependencies">
          <p>{component.dependencies.length > 0 ? component.dependencies.join(', ') : 'None'}</p>
        </DocumentationSection>

        {component.interactionType ? (
          <DocumentationSection title="Interaction type">
            <p>{component.interactionType}</p>
          </DocumentationSection>
        ) : null}

        {Boolean(component.props?.length) && <section><PropsReference props={component.props!} /></section>}

        <DocumentationSection title="Installation">
          {component.registryFile ? (
            <>
              <p>
                Copy <code>{component.registryFile}</code> into your project. No package dependency is required.
              </p>
              <CodeBlock code={`# Copy ${component.registryFile} into your component directory`} />
              <p className="mt-3 text-xs text-[var(--foreground-faint)]">
                After the Registry is deployed, install it with{' '}
                <code>npx shadcn@latest add https://blocks.ricoui.com/r/{component.slug}.json</code>.
              </p>
            </>
          ) : (
            <p>This is a temporary catalog entry and is not distributed to consumer projects.</p>
          )}
        </DocumentationSection>

        {component.usage ? (
          <DocumentationSection title="How to use">
            <CodeBlock code={component.usage} language="tsx" />
          </DocumentationSection>
        ) : null}

        <DocumentationSection title="Source code">
          {sourceCode ? (
            <ComponentSource slug={component.slug} filename={component.registryFile} />
          ) : (
            <p>
              {component.registryFile
                ? `No source mapping is available yet for ${component.registryFile}.`
                : 'This temporary entry has no distributable source file.'}
            </p>
          )}
        </DocumentationSection>

        <Credits source={component.source} />
      </div>
    </article>
  )
}

function DocumentationSection({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section aria-labelledby={`section-${title.toLowerCase().replaceAll(' ', '-')}`}>
      <h2
        id={`section-${title.toLowerCase().replaceAll(' ', '-')}`}
        className="text-sm font-medium text-[var(--foreground)]"
      >
        {title}
      </h2>
      <div className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{children}</div>
    </section>
  )
}

function Credits({ source }: { source: ComponentMeta['source'] }) {
  if (source.type === 'original') {
    return null
  }

  return (
    <DocumentationSection title="Credits">
      <p>{source.type === 'inspired' ? 'Inspired by' : 'Based on'} {source.name}</p>
      {source.author ? <p>{source.author}</p> : null}
      {source.type === 'based-on' ? <p>License: {source.license}</p> : null}
      <a
        href={source.url}
        className="underline decoration-[var(--border)] underline-offset-4 transition-colors hover:decoration-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--link)]"
        target="_blank"
        rel="noreferrer"
      >
        Source
      </a>
    </DocumentationSection>
  )
}
