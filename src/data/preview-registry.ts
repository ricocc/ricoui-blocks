import { lazy } from 'react'

export const previewRegistry = {
  'github-repo': lazy(() => import('../components/previews/github-repo-preview')),
  'bell-button': lazy(() => import('../components/previews/bell-button-preview')),
  button: lazy(() => import('../components/previews/button-preview')),
  'dither-progress': lazy(() => import('../components/previews/dither-progress-preview')),
  'flip-switch': lazy(() => import('../components/previews/flip-switch-preview')),
  'magnifier': lazy(() => import('../components/previews/magnifier-preview')),
  'file-organizer': lazy(() => import('../components/previews/file-organizer-preview')),
 'contribution-graph': lazy(() => import('../components/previews/contribution-graph-preview')),
  'empty-states': lazy(() => import('../components/previews/empty-states-preview')),
  'kubai-empty-states': lazy(() => import('../components/previews/kubai-empty-states-preview')),
  'popin-preloader': lazy(() => import('../components/previews/popin-preloader-preview')),
  'clip-image-preloader': lazy(() => import('../components/previews/clip-image-preloader-preview')),
  'step-overlap-preloader': lazy(() => import('../components/previews/step-overlap-preloader-preview')),
  'social-card': lazy(() => import('../components/previews/social-card-preview')),
  'ascii-background': lazy(() => import('../components/previews/ascii-background-preview')),
  'smoke-test': lazy(() => import('../components/previews/smoke-test-preview')),
}

export function getPreviewBySlug(slug: string) {
  return previewRegistry[slug as keyof typeof previewRegistry]
}
