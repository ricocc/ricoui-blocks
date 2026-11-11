export type PreviewPrompt = {
  component: string
  source: string
  values: Record<string, unknown>
  notes?: string
}

/** Explicit React state, never DOM labels: preserves booleans, numbers and nested props. */
export function buildPreviewPrompt({ component, source, values, notes }: PreviewPrompt) {
  return `Update the ${component} React component usage to match this preview configuration.

Component source: ${source}
Current configuration (JSON):
${JSON.stringify(values, null, 2)}

Apply these values to the component props at its call site. If a value is a style or CSS variable, apply it through the supported style/className API. Only change component defaults if explicitly requested. Preserve the existing design, interactions, accessibility and reduced-motion support. Do not add the website preview controls to the distributed component or change unrelated code.
${notes ? '\n' + notes + '\n' : ''}
After applying the configuration, check the preview and TypeScript types. Report the changed files.`
}
