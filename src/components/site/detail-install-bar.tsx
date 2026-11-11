import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../../lib/site'
import { CopyButton } from './code-block'
import { Icon } from './icon'

export const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const
export type PackageManager = (typeof packageManagers)[number]

export function installCommand(slug: string, manager: PackageManager) {
  const runner = { pnpm: 'pnpm dlx', npm: 'npx', yarn: 'yarn dlx', bun: 'bunx' }[manager]
  return `${runner} shadcn@latest add ${site.url}/r/${slug}.json`
}

export function DetailInstallBar({ slug, manager, onManagerChange }: {
  slug: string
  manager: PackageManager
  onManagerChange: (manager: PackageManager) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const command = installCommand(slug, manager)

  useEffect(() => {
    if (!menuOpen) return
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setMenuOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.stopPropagation(); setMenuOpen(false) } }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape, true)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape, true) }
  }, [menuOpen])

  return <div ref={root} className="detail-install-bar" role="group" aria-label="Install command">
    <div className="detail-manager">
      <button type="button" className="detail-manager-trigger" aria-label="Choose package manager" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{manager}<Icon name="chevron" size={13} /></button>
      <AnimatePresence initial={false}>{menuOpen && <motion.div className="detail-manager-menu" role="group" aria-label="Package manager" initial={{ opacity: 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 5 }} transition={{ duration: reduced ? 0 : .14 }}>
        {packageManagers.map(option => <button type="button" key={option} aria-pressed={manager === option} onClick={() => { onManagerChange(option); setMenuOpen(false) }}>{option}</button>)}
      </motion.div>}</AnimatePresence>
    </div>
    <span className="detail-install-divider" aria-hidden="true" />
    <code title={command}>{command}</code>
    <CopyButton text={command} label="Copy install command" iconOnly />
  </div>
}
