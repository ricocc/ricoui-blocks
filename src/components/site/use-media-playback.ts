import { useEffect, useState } from 'react'

export function useMediaPlayback() {
  const [reduced, setReduced] = useState(true)
  const [choice, setChoice] = useState<boolean | null>(null)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  const paused = choice ?? reduced
  return { paused, toggle: () => setChoice(!paused) }
}
