type ComponentMedia = {
  image?: string
  video?: string
}

// New media can be added as <slug>/<slug>.<extension> under assets/components.
// Existing single-file images remain supported.
const assets = import.meta.glob<string>(
  '../assets/components/**/*.{jpg,jpeg,png,webp,svg,mp4,webm}',
  { eager: true, query: '?url', import: 'default' },
)

export function getComponentMedia(slug: string): ComponentMedia {
  const root = '../assets/components/'
  const find = (extensions: string[]) => {
    for (const extension of extensions) {
      const nested = assets[`${root}${slug}/${slug}.${extension}`]
      if (nested) return nested
    }
    for (const extension of extensions) {
      const flat = assets[`${root}${slug}.${extension}`]
      if (flat) return flat
    }
    return undefined
  }

  return {
    image: find(['webp', 'jpg', 'jpeg', 'png', 'svg']),
    video: find(['mp4', 'webm']),
  }
}
