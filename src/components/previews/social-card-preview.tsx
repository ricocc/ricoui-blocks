import { SocialCard, type SocialCardItem } from '../../../registry/social-card'

export const socialCardPreviewItems: SocialCardItem[] = [
  { platform: 'github', href: 'https://github.com/ricocc', username: 'author' },
  { platform: 'twitter', href: 'https://x.com/ricouii', username: 'author' },
  { platform: 'behance', href: 'https://www.behance.net/ricoui', username: 'author' },
  { platform: 'dribbble', href: 'https://dribbble.com/ricoui', username: 'author' },
  { platform: 'email', href: 'mailto:ricocc@qq.com', username: 'author' },
]

export default function SocialCardPreview({ size = 120, layout = 'stack', direction = 'center' }: { size?: number; layout?: 'stack' | 'grid'; direction?: 'left' | 'center' | 'right' }) {
  return <div style={{ width: '100%', maxWidth: 900, marginInline: 'auto' }}><SocialCard items={socialCardPreviewItems} size={size} layout={layout} direction={direction} /></div>
}
