import { KubaiEmptyStates, type KubaiEmptyState } from '../../../registry/kubai-empty-states'

const states: { value: KubaiEmptyState; label: string }[] = [
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

export default function KubaiEmptyStatesPreview({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  return <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4" aria-label="All empty states">
    {states.map(item => <div key={item.value} className="flex min-w-0 flex-col items-center justify-center rounded-2xl px-4 py-7 text-center" style={{ background: theme === 'light' ? '#fff' : '#1d1d20', color: theme === 'light' ? '#28282d' : '#f4f4f5' }}>
      <KubaiEmptyStates state={item.value} theme={theme} width={160} height={120} title="" className="h-auto max-w-full" />
      <p className="text-sm font-medium" style={{ marginTop: 20 }}>{item.label}</p>
    </div>)}
  </div>
}
