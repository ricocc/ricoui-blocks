import githubRepoSource from '../../registry/github-repo.tsx?raw'
import bellButtonSource from '../../registry/bell-button.tsx?raw'
import buttonSource from '../../registry/button.tsx?raw'
import ditherProgressSource from '../../registry/dither-progress.tsx?raw'
import flipSwitchSource from '../../registry/flip-switch.tsx?raw'
import magnifierSource from '../../registry/magnifier.tsx?raw'
import fileOrganizerSource from '../../registry/file-organizer.tsx?raw'
import contributionGraphSource from '../../registry/contribution-graph.tsx?raw'
import emptyStatesSource from '../../registry/empty-states.tsx?raw'
import kubaiEmptyStatesSource from '../../registry/kubai-empty-states.tsx?raw'
import popinPreloaderSource from '../../registry/popin-preloader.tsx?raw'
import clipImagePreloaderSource from '../../registry/clip-image-preloader.tsx?raw'
import stepOverlapPreloaderSource from '../../registry/step-overlap-preloader.tsx?raw'
import asciiBackgroundSource from '../../registry/ascii-background.tsx?raw'
import asciiBackgroundHtml from '../../registry/ascii-background.html?raw'
import socialCardSource from '../../registry/social-card.tsx?raw'
import socialCardHtml from '../../registry/social-card.html?raw'

const sourceCode: Record<string, string> = {
  'github-repo': githubRepoSource,
  'bell-button': bellButtonSource,
  button: buttonSource,
  'dither-progress': ditherProgressSource,
  'flip-switch': flipSwitchSource,
  'magnifier': magnifierSource,
  'file-organizer': fileOrganizerSource,
 'contribution-graph': contributionGraphSource,
  'empty-states': emptyStatesSource,
  'kubai-empty-states': kubaiEmptyStatesSource,
  'popin-preloader': popinPreloaderSource,
  'clip-image-preloader': clipImagePreloaderSource,
  'step-overlap-preloader': stepOverlapPreloaderSource,
  'social-card': socialCardSource,
  'ascii-background': asciiBackgroundSource,
}

export function getSourceCode(slug: string) {
  return sourceCode[slug]
}

const htmlSourceCode: Record<string, string> = {
  'ascii-background': asciiBackgroundHtml,
  'social-card': socialCardHtml,
}

export function getHtmlSourceCode(slug: string) { return htmlSourceCode[slug] }
