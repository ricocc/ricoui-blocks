import { useState } from 'react'

const modes = {
  calm: {
    label: 'Calm',
    panel: 'bg-[var(--surface)]',
    accent: 'bg-[var(--foreground)]',
  },
  focus: {
    label: 'Focus',
    panel: 'bg-[var(--foreground)]',
    accent: 'bg-[var(--surface)]',
  },
} as const

export default function SmokeTestPreview() {
  const [mode, setMode] = useState<keyof typeof modes>('calm')
  const activeMode = modes[mode]

  return (
    <div className="flex min-h-64 flex-col justify-between bg-[var(--surface-subtle)] p-5 sm:min-h-80 sm:p-7">
      <div className={`w-full max-w-72 rounded-[16px] border border-[var(--border)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] ${activeMode.panel}`}>
        <div className={`h-2 w-12 rounded-full ${activeMode.accent}`} />
        <div className={`mt-8 h-2 w-full rounded-full ${mode === 'calm' ? 'bg-[var(--border)]' : 'bg-white/25'}`} />
        <div className={`mt-3 h-2 w-4/5 rounded-full ${mode === 'calm' ? 'bg-[var(--border-subtle)]' : 'bg-white/15'}`} />
        <div className={`mt-8 h-9 rounded-[10px] ${mode === 'calm' ? 'bg-[var(--foreground)]' : 'bg-[var(--surface)]'}`} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--foreground-muted)]">Preview control</p>
        <div className="inline-flex rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-1">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((option) => {
            const isActive = option === mode

            return (
              <button
                key={option}
                type="button"
                aria-pressed={isActive}
                onClick={() => setMode(option)}
                className={`h-8 rounded-[7px] px-3 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--link)] ${
                  isActive
                    ? 'bg-[var(--foreground)] text-[var(--surface)]'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {modes[option].label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
