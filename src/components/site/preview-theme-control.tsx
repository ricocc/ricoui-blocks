import { useId, useRef } from 'react'
import { Icon } from './icon'

type PreviewTheme = 'light' | 'dark'
const themes = ['light', 'dark'] as const

export function PreviewThemeControl({ value, onChange }: { value: PreviewTheme; onChange: (theme: PreviewTheme) => void }) {
  const labelId = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  return <div className="preview-theme-field">
    <span id={labelId} className="preview-theme-label">Theme</span>
    <div className="preview-theme-switch" role="radiogroup" aria-labelledby={labelId} data-value={value}>
      <span className="preview-theme-selection" aria-hidden="true" />
      {themes.map((theme, index) => <button key={theme} ref={node => { buttons.current[index] = node }}
        type="button" role="radio" aria-checked={value === theme} tabIndex={value === theme ? 0 : -1}
        className="preview-theme-option" onClick={() => onChange(theme)}
        onKeyDown={event => {
          let next: number
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % themes.length
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + themes.length - 1) % themes.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = themes.length - 1
          else return
          event.preventDefault()
          event.stopPropagation()
          onChange(themes[next])
          buttons.current[next]?.focus()
        }}>
        <Icon name={theme === 'light' ? 'sun' : 'moon'} size={16} className="preview-theme-icon" />
        <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
        <span className="preview-theme-dot" aria-hidden="true" />
      </button>)}
    </div>
  </div>
}
