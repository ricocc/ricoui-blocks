import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Only the languages and themes used by the site are bundled.
const highlighter = createHighlighterCore({
  themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark-dimmed')],
  langs: [import('@shikijs/langs/html'), import('@shikijs/langs/tsx'), import('@shikijs/langs/shellscript')],
  engine: createJavaScriptRegexEngine(),
})

export async function highlightCode(code: string, language: string) {
  const instance = await highlighter
  return instance.codeToTokens(code, {
    lang: language === 'terminal' || language === 'bash' ? 'shellscript' : language === 'html' ? 'html' : 'tsx',
    themes: { light: 'github-light', dark: 'github-dark-dimmed' },
  }).tokens
}
