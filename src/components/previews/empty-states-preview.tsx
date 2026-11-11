import { EmptyStates, type EmptyState } from '../../../registry/empty-states'

const states: { value: EmptyState; label: string }[] = [
  { value: 'blockedPage', label: 'Page unavailable' },
  { value: 'noResults', label: 'No results' },
  { value: 'noCommands', label: 'No commands' },
  { value: 'noTabs', label: 'No open tabs' },
  { value: 'emptyFolder', label: 'Empty folder' },
  { value: 'emptyList', label: 'Empty list' },
  { value: 'loadFailed', label: 'Unable to load' },
  { value: 'nothing', label: 'Nothing here yet' },
  { value: 'offline', label: 'You are offline' },
  { value: 'accessDenied', label: 'Access denied' },
  { value: 'sessionExpired', label: 'Session expired' },
  { value: 'noNotifications', label: 'No notifications' },
]

export default function EmptyStatesPreview({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  return <div className="empty-gallery" data-theme={theme} aria-label="All empty states">
    {states.map(item => <div key={item.value} className="empty-cell">
      <EmptyStates state={item.value} theme={theme} width={208} height={156} title="" className="h-auto max-w-full" />
      <p>{item.label}</p>
    </div>)}
  </div>
}
