import { useState } from 'react'
import { BellButton } from '../../../registry/bell-button'

export default function BellButtonPreview({ disabled = false }: { disabled?: boolean }) {
  const [following, setFollowing] = useState(true)
  const [notifying, setNotifying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [alternateMuted, setAlternateMuted] = useState(true)

  return (
    <div className="mx-auto grid min-h-64 w-full max-w-xl content-center gap-6 px-2 py-6">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
        <BellButton pressed={following} aria-label="Follow updates" disabled={disabled} onClick={() => setFollowing(!following)}>
          {following ? 'Following' : 'Follow'}
        </BellButton>
        <BellButton pressed={notifying} aria-label="Notify me" count={1072} disabled={disabled} onClick={() => setNotifying(!notifying)}>
          {notifying ? 'Notifying' : 'Notify me'}
        </BellButton>
        <div className="flex gap-3">
          <BellButton size="icon" variant="outline" muted={muted} pressed={muted} aria-label="Mute alerts" disabled={disabled} onClick={() => setMuted(!muted)} />
          <BellButton size="icon" variant="outline" muted={alternateMuted} pressed={alternateMuted} aria-label="Mute reminders" disabled={disabled} onClick={() => setAlternateMuted(!alternateMuted)} />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-4">
        <BellButton isLoading />
        <BellButton disabled>Disabled</BellButton>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 border-t [border-color:light-dark(#c9d7ec,#3b4a5c)] pt-6">
        <BellButton size="sm" variant="outline" disabled={disabled}>Small</BellButton>
        <BellButton variant="outline" disabled={disabled}>Medium</BellButton>
        <BellButton size="lg" variant="outline" disabled={disabled}>Large</BellButton>
        <BellButton size="icon" variant="outline" disabled={disabled} aria-label="Notification example" />
      </div>
    </div>
  )
}
