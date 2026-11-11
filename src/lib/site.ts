export const site = {
  name: 'RicoUI Blocks',
  url: 'https://blocks.ricoui.com',
  github: 'https://github.com/ricocc/ricoui-blocks',
  description: 'Thoughtful React components. Expressive interactions. Copy the source and make it yours with Tailwind CSS.',
}

export function pageHead(title: string, description = site.description, path = '/') {
  const url = site.url + path
  const image = site.url + '/og.jpg'
  return {
    meta: [
      { title: title + ' — RicoUI Blocks' },
      { name: 'description', content: description },
      { property: 'og:title', content: title + ' — RicoUI Blocks' },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: image },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

