import { useId, type SVGProps } from 'react'

/**
 * Visual inspiration: 枯白啃设计 https://x.com/Kubai087
 * Lumno https://lumno.kubai.design — independently implemented from the visual brief.
 * Embedded line icons: Remix Icon v4.6.0, Copyright Remix Design.
 * https://github.com/Remix-Design/RemixIcon/tree/v4.6.0
 * Rendering size and color are adapted. Inbox, lock, folder, bell, and Wi-Fi
 * prohibition, and user paths are split or reconstructed as independently animated parts. License included below.
 */

export type KubaiEmptyState = 'blockedPage' | 'noResults' | 'noCommands' | 'noTabs' | 'emptyFolder' | 'emptyList' | 'loadFailed' | 'nothing' | 'offline' | 'accessDenied' | 'sessionExpired' | 'noNotifications'
export type KubaiEmptyStatesProps = Omit<SVGProps<SVGSVGElement>, 'id' | 'children' | 'title'> & {
  state?: KubaiEmptyState
  theme?: 'light' | 'dark' | 'auto'
  /** Accessible description. Pass an empty string for a decorative illustration. */
  title?: string
  animated?: boolean
}

const labels: Record<KubaiEmptyState, string> = {
  blockedPage: 'This page cannot be previewed', noResults: 'No matching results',
  noCommands: 'No matching commands', noTabs: 'No open tabs',
  emptyFolder: 'This bookmark folder is empty', emptyList: 'This list is empty',
  loadFailed: 'Unable to load content', nothing: 'Nothing here yet',
  offline: 'You are offline', accessDenied: 'Access denied', sessionExpired: 'Your session has expired', noNotifications: 'No notifications',
}

const paths = {
  "key-2": 'M10.7577 11.8281L18.6066 3.97919L20.0208 5.3934L18.6066 6.80761L21.0815 9.28249L19.6673 10.6967L17.1924 8.22183L15.7782 9.63604L17.8995 11.7574L16.4853 13.1716L14.364 11.0503L12.1719 13.2423C13.4581 15.1837 13.246 17.8251 11.5355 19.5355C9.58291 21.4882 6.41709 21.4882 4.46447 19.5355C2.51184 17.5829 2.51184 14.4171 4.46447 12.4645C6.17493 10.754 8.81633 10.5419 10.7577 11.8281ZM10.1213 18.1213C11.2929 16.9497 11.2929 15.0503 10.1213 13.8787C8.94975 12.7071 7.05025 12.7071 5.87868 13.8787C4.70711 15.0503 4.70711 16.9497 5.87868 18.1213C7.05025 19.2929 8.94975 19.2929 10.1213 18.1213Z',
"wifi-off":"M12.0001 18C12.7144 18 13.3704 18.2497 13.8856 18.6665L12.0001 21L10.1145 18.6665C10.6297 18.2497 11.2857 18 12.0001 18ZM2.80766 1.39343L20.4853 19.0711L19.0711 20.4853L13.8913 15.3042C13.2967 15.1069 12.6609 15 12.0001 15C10.5719 15 9.26024 15.499 8.22998 16.3322L6.97363 14.7759C8.24961 13.7442 9.84925 13.0969 11.5964 13.01L9.00025 10.414C7.55273 10.8234 6.22651 11.5217 5.0878 12.4426L3.83099 10.8868C4.89946 10.0226 6.10763 9.32438 7.41633 8.83118L5.13168 6.5451C3.98878 7.08913 2.92058 7.76472 1.94666 8.55228L0.689453 6.99674C1.60358 6.25747 2.59156 5.60589 3.64058 5.05479L1.39345 2.80765L2.80766 1.39343ZM14.5004 10.2854L12.2165 8.00243L12 8C15.0947 8 17.9369 9.08141 20.1693 10.8869L18.9123 12.4426C17.6438 11.4167 16.1427 10.6672 14.5004 10.2854ZM12.0001 3.00003C16.2849 3.00003 20.22 4.49719 23.3109 6.99691L22.0534 8.55228C19.3061 6.33062 15.8085 5.00003 12.0001 5.00003C11.122 5.00003 10.2604 5.07077 9.42075 5.20685L7.72455 3.51088C9.09498 3.17702 10.5268 3.00003 12.0001 3.00003Z",
"lock":"M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z",
"user":"M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z",
"notification-3":"M20 17H22V19H2V17H4V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V17ZM18 17V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V17H18ZM9 21H15V23H9V21Z",
  "search": "M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z",
  "file": "M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z",
  "folder": "M4 5V19H20V7H11.5858L9.58579 5H4ZM12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z",
  "inbox": "M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM7.41604 14H4V19H20V14H16.584C15.8124 15.7659 14.0503 17 12 17C9.94968 17 8.1876 15.7659 7.41604 14ZM20 5H4V12H9C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12H20V5Z",
  "forbid": "M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM8.52313 7.10891L16.8911 15.4769C16.6997 15.7454 16.4836 16.0017 16.2426 16.2426C16.0017 16.4836 15.7454 16.6997 15.4769 16.8911L7.10891 8.52313C7.30029 8.25459 7.51644 7.99828 7.75736 7.75736C7.99828 7.51644 8.25459 7.30029 8.52313 7.10891Z",
  "external-link": "M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z",
  "file-copy": "M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z",
  "close": "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
  "add": "M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z",
  "refresh": "M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z",
  "cloud-off": "M3.51472 2.10051L22.6066 21.1924L21.1924 22.6066L19.1782 20.5924C18.503 20.8556 17.7684 21 17 21H7C3.68629 21 1 18.3137 1 15C1 12.3846 2.67346 10.16 5.00804 9.33857C5.0027 9.22639 5 9.11351 5 9C5 8.22228 5.12683 7.47418 5.36094 6.77527L2.10051 3.51472L3.51472 2.10051ZM7 9C7 9.08147 7.00193 9.16263 7.00578 9.24344L7.07662 10.7309L5.67183 11.2252C4.0844 11.7837 3 13.2889 3 15C3 17.2091 4.79086 19 7 19H17C17.1858 19 17.3687 18.9873 17.5478 18.9628L7.03043 8.44519C7.01032 8.62736 7 8.81247 7 9ZM12 2C15.866 2 19 5.13401 19 9C19 9.11351 18.9973 9.22639 18.992 9.33857C21.3265 10.16 23 12.3846 23 15C23 16.0883 22.7103 17.1089 22.2037 17.9889L20.7111 16.4955C20.8974 16.0335 21 15.5287 21 15C21 12.79 19.21 11 17 11C16.4711 11 15.9661 11.1027 15.5039 11.2892L14.0111 9.7964C14.8912 9.28978 15.9118 9 17 9C17 6.23858 14.7614 4 12 4C10.9295 4 9.93766 4.33639 9.12428 4.90922L7.69418 3.48056C8.88169 2.55284 10.3763 2 12 2Z",
  "global": "M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z"
} as const

function Icon({ name, x, y, size = 12, color = 'var(--ke-icon)' }: { name: keyof typeof paths; x: number; y: number; size?: number; color?: string }) {
  return <g className={`ke-icon ke-icon-${name}`}><g transform={`translate(${x} ${y}) scale(${size / 24})`} fill={color}><path d={paths[name]} /></g></g>
}

// Keep the prohibition ring anchored; only its diagonal reacts before the link is selected.
function BlockedIcon() {
  return <g className="ke-icon ke-icon-forbid" transform={`translate(57 55) scale(${22 / 24})`}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="var(--ke-icon)" strokeWidth="2" />
    <path className="ke-motion ke-block-slash" fill="var(--ke-icon)" d="M8.52313 7.10891L16.8911 15.4769C16.6997 15.7454 16.4836 16.0017 16.2426 16.2426C16.0017 16.4836 15.7454 16.6997 15.4769 16.8911L7.10891 8.52313C7.30029 8.25459 7.51644 7.99828 7.75736 7.75736C7.99828 7.51644 8.25459 7.30029 8.52313 7.10891Z" />
  </g>
}

// Keep shared symbols identical across scenes; animate parts inside their 24-unit geometry.
function InboxIcon({ x, y }: { x: number; y: number }) {
  return <g className="ke-icon ke-icon-inbox" transform={`translate(${x} ${y}) scale(${22 / 24})`} fill="var(--ke-icon)">
    <path fillRule="evenodd" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v14h16V5H4Z" />
    <path className="ke-motion ke-tray" d="M4 12h5a3 3 0 0 0 6 0h5v2h-3.416a5 5 0 0 1-9.168 0H4v-2Z" />
  </g>
}

function FolderIcon() {
  return <g className="ke-icon ke-icon-folder" transform={`translate(31.5 32.5) scale(${16 / 24})`} fill="var(--ke-accent)">
    <path d="M2 7h2v12h16V7h2v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Z" />
    <path className="ke-motion ke-folder-flap" d="M2 7V4a1 1 0 0 1 1-1h7.4142l2 2H21a1 1 0 0 1 1 1v1H11.5858l-2-2H4v2H2Z" />
  </g>
}

function BellIcon() {
  return <g className="ke-icon ke-icon-notification-3" transform={`translate(71 54) scale(${18 / 24})`} fill="var(--ke-icon)">
    <path className="ke-motion ke-bell-shell" d="M20 17h2v2H2v-2h2v-7a8 8 0 0 1 16 0v7Zm-2 0v-7a6 6 0 0 0-12 0v7h12Z" />
    <path className="ke-motion ke-bell-clapper" d="M9 21h6v2H9z" />
  </g>
}

function OfflineIcon() {
  // Remix's disconnected Wi-Fi path has four closed parts: dot, slash/left arcs,
  // middle-right arc, outer-right arc. Keep the slash fixed while the arcs weaken.
  const parts = paths['wifi-off'].match(/[^Z]+Z/g) ?? []
  return <g className="ke-icon ke-icon-wifi-off" transform={`translate(67 49) scale(${21 / 24})`} fill="var(--ke-icon)">
    {parts.map((d, index) => <path key={index} d={d} className={index > 1 ? `ke-motion ke-signal${index === 2 ? ' ke-signal-inner' : ''}` : undefined} />)}
  </g>
}

function Bar({ x, y, width, heading = false }: { x: number; y: number; width: number; heading?: boolean }) {
  return <rect x={x} y={y} width={width} height={heading ? 5 : 4} rx="2" fill={heading ? 'var(--ke-heading)' : 'var(--ke-line)'} />
}

/** A self-contained 160 × 120 SVG. No external assets, icon package, or site styles. */
export function KubaiEmptyStates({ state = 'emptyFolder', theme = 'auto', title = labels[state], animated = true, width = 160, height = 120, ...props }: KubaiEmptyStatesProps) {
  // Encode rather than strip useId characters so distinct React IDs stay distinct.
  const id = 'kubai-' + Array.from(useId(), char => char.codePointAt(0)!.toString(16)).join('-')
  const shadow = `url(#${id}-shadow)`
  const surface = 'var(--ke-surface)'
  const border = 'var(--ke-border)'
  // A shared six-second rhythm, with deterministic offsets across the gallery.
  const phase = Object.keys(labels).indexOf(state) * -.47

  const dark = '--ke-bg:#26262b;--ke-stripe:rgba(255,255,255,.035);--ke-border:rgba(255,255,255,.07);--ke-surface:#323238;--ke-tab:#2a2a2f;--ke-line:#3f3f47;--ke-heading:#52525b;--ke-cell:#29292f;--ke-back:#2d2d33;--ke-icon:#7d828c;--ke-secondary:#9297a1;--ke-accent:#7ea6ea;--ke-shadow:#000;--ke-opacity:.36;'
  function windowFrame(x: number, y: number, w: number, h: number) {
    return <><rect x={x} y={y} width={w} height={h} rx="11" fill={surface} stroke={border} />
      <path d={`M${x + 11} ${y}h${w - 22}q11 0 11 11v7H${x}v-7q0-11 11-11`} fill="var(--ke-tab)" />
      <path d={`M${x + 6} ${y + 18}v-10q0-4 4-4h38q4 0 4 4v10`} fill={surface} stroke={border} />
      <Icon name="global" x={x + 11} y={y + 7.5} size={9} /><Bar x={x + 24} y={y + 10} width={24} />
    </>
  }
  return <svg {...props} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width={width} height={height} data-theme={theme} data-state={state} data-animated={animated} role={title ? 'img' : undefined} aria-labelledby={title ? `${id}-title` : undefined} aria-hidden={title ? undefined : true} focusable="false">
    {title && <title id={`${id}-title`}>{title}</title>}
    <style>{`
      #${id}{--ke-bg:#fafafa;--ke-stripe:rgba(15,23,42,.05);--ke-border:rgba(47,42,34,.08);--ke-surface:#fff;--ke-tab:#eef1f5;--ke-line:#e5e9ef;--ke-heading:#cdd4de;--ke-cell:#f1f3f6;--ke-back:#f3f3f4;--ke-icon:#a3abb7;--ke-secondary:#6b7280;--ke-accent:#3462ad;--ke-shadow:rgb(47,42,34);--ke-opacity:.13}
      #${id}[data-theme="dark"]{${dark}}
      @media(prefers-color-scheme:dark){#${id}[data-theme="auto"]{${dark}}}
      #${id} .ke-motion{transform-box:fill-box;transform-origin:center}
      #${id} .ke-query{transform-origin:left center}
      #${id} .ke-link-button{color:var(--ke-icon)}
      #${id} .ke-link-disc{fill:var(--ke-surface);stroke:var(--ke-border)}
      @media(prefers-reduced-motion:no-preference){
        #${id}[data-animated="true"] .ke-motion{animation-duration:6s;animation-timing-function:cubic-bezier(.4,0,.2,1);animation-iteration-count:infinite;animation-delay:${phase}s}
        #${id}[data-animated="true"] .ke-dim{animation-name:${id}-dim}
        #${id}[data-animated="true"] .ke-action{animation-name:${id}-action}
        #${id}[data-animated="true"] .ke-link-button{animation-name:${id}-select}
        #${id}[data-animated="true"] .ke-link-disc{animation-name:${id}-select-disc}
        #${id}[data-animated="true"] .ke-search{animation-name:${id}-search}
        #${id}[data-animated="true"] .ke-result{animation-name:${id}-result}
        #${id}[data-animated="true"] .ke-query{animation-name:${id}-query}
        #${id}[data-animated="true"] .ke-caret{animation-name:${id}-caret}
        #${id}[data-animated="true"] .ke-block-slash{animation-name:${id}-block-slash}
        #${id}[data-animated="true"] .ke-tab-reveal{animation-name:${id}-tab-reveal}
        #${id}[data-animated="true"] .ke-tab-add{animation-name:${id}-tab-add}
        #${id}[data-animated="true"] .ke-press{animation-name:${id}-press}
        #${id}[data-animated="true"] .ke-row{animation-name:${id}-row}
        #${id}[data-animated="true"] .ke-row-later{animation-delay:${phase + .3}s}
        #${id}[data-animated="true"] .ke-retry{animation-name:${id}-retry}
        #${id}[data-animated="true"] .ke-tray{animation-name:${id}-tray}
        #${id}[data-animated="true"] .ke-empty-line{animation-name:${id}-empty-line}
        #${id}[data-animated="true"] .ke-shackle{animation-name:${id}-shackle;transform-box:view-box;transform-origin:6px 10px}
        #${id}[data-animated="true"] .ke-lock-body{animation-name:${id}-lock-body}
        #${id}[data-animated="true"] .ke-keyhole{animation-name:${id}-keyhole}
        #${id}[data-animated="true"] .ke-user-head{animation-name:${id}-user-head}
        #${id}[data-animated="true"] .ke-user-shoulders{animation-name:${id}-user-shoulders}
        #${id}[data-animated="true"] .ke-key{animation-name:${id}-key}
        #${id}[data-animated="true"] .ke-folder-flap{animation-name:${id}-folder-flap;transform-origin:left bottom}
        #${id}[data-animated="true"] .ke-bell-shell{animation-name:${id}-bell;transform-origin:50% 0}
        #${id}[data-animated="true"] .ke-bell-clapper{animation-name:${id}-clapper}
        #${id}[data-animated="true"] .ke-signal{animation-name:${id}-signal}
        #${id}[data-animated="true"] .ke-signal-inner{animation-delay:${phase + .24}s}
      }
      @keyframes ${id}-dim{0%,38%,100%{opacity:1}10%,22%{opacity:.5}}
      @keyframes ${id}-action{0%,18%,42%,100%{transform:scale(1)}27%,32%{transform:scale(1.04)}}
      @keyframes ${id}-select{0%,10%,55%,100%{transform:scale(1);color:var(--ke-icon)}23%,40%{transform:scale(1.12);color:var(--ke-surface)}}
      @keyframes ${id}-select-disc{0%,10%,55%,100%{fill:var(--ke-surface);stroke:var(--ke-border)}23%,40%{fill:var(--ke-accent);stroke:var(--ke-accent)}}
      @keyframes ${id}-search{0%,32%,100%{transform:translateX(0)}12%{transform:translateX(2px)}22%{transform:translateX(-1px)}}
      @keyframes ${id}-result{0%,10%,42%,100%{transform:translateY(0);opacity:1}23%,30%{transform:translateY(2px);opacity:.55}}
      @keyframes ${id}-query{0%,42%,100%{transform:scaleX(1)}12%,20%{transform:scaleX(.72)}29%{transform:scaleX(.9)}}
      @keyframes ${id}-caret{0%,8%,18%,28%,42%,100%{opacity:1}13%,23%,35%{opacity:.2}}
      @keyframes ${id}-block-slash{0%,4%,22%,100%{transform:rotate(0);fill:var(--ke-icon)}10%,14%{transform:rotate(-6deg);fill:var(--ke-secondary)}}
      @keyframes ${id}-tab-reveal{0%,8%,55%,100%{width:12px}26%,40%{width:48px}}
      @keyframes ${id}-tab-add{0%,4%,22%,100%{opacity:1}10%{opacity:.45}}
      @keyframes ${id}-press{0%,5%,26%,100%{transform:scale(1)}14%{transform:scale(.96)}}
      @keyframes ${id}-row{0%,8%,35%,100%{opacity:1}20%{opacity:.5}}
      @keyframes ${id}-retry{0%,6%{transform:rotate(0)}32%,100%{transform:rotate(360deg)}}
      @keyframes ${id}-tray{0%,8%,42%,100%{transform:translateY(0)}18%,25%{transform:translateY(1.6px)}34%{transform:translateY(-.3px)}}
      @keyframes ${id}-empty-line{0%,14%,44%,100%{opacity:1}26%,32%{opacity:.55}}
      @keyframes ${id}-shackle{0%,12%,100%{transform:translateY(-2px) rotate(-12deg)}24%{transform:translateY(.5px) rotate(0)}30%,84%{transform:translateY(0) rotate(0)}}
      @keyframes ${id}-lock-body{0%,20%,34%,100%{transform:translateY(0)}25%{transform:translateY(.6px)}}
      @keyframes ${id}-keyhole{0%,14%,100%{opacity:.5}28%,84%{opacity:1}}
      @keyframes ${id}-user-head{0%,4%,38%,100%{transform:translateY(0);opacity:1}12%,25%{transform:translateY(.8px);opacity:.55}}
      @keyframes ${id}-user-shoulders{0%,9%,42%,100%{opacity:1}18%,29%{opacity:.65}}
      @keyframes ${id}-key{0%,12%,42%,100%{transform:rotate(0)}23%,31%{transform:rotate(-15deg)}}
      @keyframes ${id}-folder-flap{0%,8%,42%,100%{transform:translateY(0) rotate(0)}18%,26%{transform:translateY(-.7px) rotate(-5deg)}}
      @keyframes ${id}-clapper{0%,8%,32%,100%{transform:translateX(0)}14%{transform:translateX(1.1px)}21%{transform:translateX(-.8px)}27%{transform:translateX(.3px)}}
      @keyframes ${id}-signal{0%,7%,44%,100%{opacity:1}18%,29%{opacity:.25}}
      @keyframes ${id}-bell{0%,5%,26%,100%{transform:rotate(0)}11%{transform:rotate(-6deg)}17%{transform:rotate(4deg)}22%{transform:rotate(-2deg)}}
    `}</style>
    <defs>
      {state === 'noTabs' && <clipPath id={`${id}-tab-reveal`} clipPathUnits="userSpaceOnUse"><rect className="ke-motion ke-tab-reveal" x="27" y="26" width="48" height="18" /></clipPath>}
      <pattern id={`${id}-stripes`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V7" stroke="var(--ke-stripe)" strokeWidth="1" /></pattern>
      <filter id={`${id}-shadow`} x="-40%" y="-45%" width="180%" height="210%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" /><feOffset dy="5" result="offset" />
        <feFlood floodColor="var(--ke-shadow)" floodOpacity="var(--ke-opacity)" /><feComposite in2="offset" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect width="160" height="120" rx="18" fill="var(--ke-bg)" />
    <rect width="160" height="120" rx="18" fill={`url(#${id}-stripes)`} />
    <rect x=".5" y=".5" width="159" height="119" rx="17.5" fill="none" stroke="var(--ke-border)" />
    <g key={state}>
      {(state === 'blockedPage' || state === 'loadFailed') && <>
        <g filter={shadow}>{windowFrame(18, 22, 100, 78)}
          <g className={state === 'loadFailed' ? 'ke-motion ke-dim' : undefined}>{state === 'blockedPage' ? <BlockedIcon /> : <Icon name="cloud-off" x={57} y={55} size={22} />}
          <Bar x={48} y={84} width={40} /></g>
        </g>
        {state === 'blockedPage' ? <>
          <g filter={shadow}><circle cx="133" cy="31" r="9" fill={surface} stroke={border} /><Icon name="close" x={128} y={26} size={10} />
            <circle cx="133" cy="78" r="9" fill={surface} stroke={border} /><Icon name="file-copy" x={128} y={73} size={10} /></g>
          <g filter={shadow}><g className="ke-motion ke-link-button"><circle className="ke-motion ke-link-disc" cx="133" cy="55" r="9" /><Icon name="external-link" x={128} y={50} size={10} color="currentColor" /></g></g>
        </> : <g filter={shadow}><circle cx="117" cy="94" r="13" fill={surface} stroke={border} /><g className="ke-motion ke-retry"><Icon name="refresh" x={110} y={87} size={14} color="var(--ke-accent)" /></g></g>}
      </>}
      {(state === 'noResults' || state === 'noCommands') && <>
        <g filter={shadow}><rect x="25" y="56" width="110" height="41" rx="12" fill={surface} stroke={border} />
          <g className="ke-motion ke-result"><Icon name="file" x={50} y={71} size={11} /><Bar x={67} y={75} width={43} /></g>
        </g>
        <g filter={shadow}><rect x="16" y="24" width="128" height="24" rx="12" fill={surface} stroke={border} />
          {state === 'noResults' ? <g className="ke-motion ke-search"><Icon name="search" x={24} y={30} size={12} color="var(--ke-secondary)" /></g> : <><rect x="22" y="29" width="14" height="14" rx="4" fill="var(--ke-cell)" stroke={border} /><path className="ke-command" d="m31 32-4 8" stroke="var(--ke-secondary)" strokeWidth="1.8" strokeLinecap="round" /></>}
          <g className={state === 'noCommands' ? 'ke-motion ke-query' : undefined}><Bar x={42} y={34} width={38} heading /></g>
          <path className={state === 'noCommands' ? 'ke-motion ke-caret' : undefined} d="M86 30v12" stroke="var(--ke-accent)" strokeWidth="1.5" />
        </g>
      </>}
      {state === 'noTabs' && <g filter={shadow}>
        <rect x="21" y="23" width="118" height="76" rx="12" fill={surface} stroke={border} />
        <path d="M33 23h94q12 0 12 12v7H21v-7q0-12 12-12" fill="var(--ke-tab)" />
        <g clipPath={`url(#${id}-tab-reveal)`}><path d="M28 42V31q0-4 4-4h37q4 0 4 4v11" fill="none" stroke="var(--ke-heading)" strokeDasharray="3 3" /></g>
        <g className="ke-motion ke-tab-add"><Icon name="add" x={79} y={29} size={11} color="var(--ke-secondary)" /></g>
        <rect x="31" y="52" width="98" height="37" rx="7" fill="var(--ke-cell)" />
      </g>}
      {state === 'emptyFolder' && <>
        <rect x="34" y="20" width="91" height="63" rx="11" fill="var(--ke-back)" stroke={border} />
        <g filter={shadow}><rect x="25" y="26" width="110" height="74" rx="12" fill={surface} stroke={border} />
          <FolderIcon /><Bar x={52} y={38} width={40} heading />
          {[0, 1].map(row => <g key={row} className={`ke-motion ke-row${row ? ' ke-row-later' : ''}`}>
            {[0, 1, 2, 3].map(col => <rect key={col} x={33 + col * 24} y={54 + row * 22} width="20" height="18" rx="5" fill="var(--ke-cell)" />)}
          </g>)}
        </g>
      </>}
      {state === 'emptyList' && <g filter={shadow}>
        <rect x="20" y="22" width="120" height="76" rx="12" fill={surface} stroke={border} />
        <Bar x={32} y={34} width={44} heading /><path d="M21 49h118" stroke={border} />
        <g className="ke-motion ke-press"><circle cx="116" cy="36.5" r="7" fill={surface} stroke={border} /><Icon name="add" x={111} y={31.5} size={10} color="var(--ke-secondary)" /></g>
        <InboxIcon x={69} y={59} /><g className="ke-motion ke-empty-line"><Bar x={60} y={83} width={40} /></g>
      </g>}
      {state === 'nothing' && <>
        <rect x="34" y="24" width="92" height="61" rx="12" fill="var(--ke-back)" stroke={border} />
        <g filter={shadow}><rect x="24" y="31" width="112" height="65" rx="13" fill={surface} stroke={border} />
          <InboxIcon x={69} y={45} />
          <g className="ke-motion ke-empty-line"><Bar x={58} y={72} width={44} heading /><Bar x={65} y={82} width={30} /></g>
        </g>
      </>}
      {state === 'offline' && <>
        <g filter={shadow}>{windowFrame(23, 22, 108, 72)}
          <OfflineIcon /><Bar x={52} y={79} width={49} />
        </g>
        <g filter={shadow}><rect x="52" y="90" width="56" height="14" rx="7" fill={surface} stroke={border} /></g>
        <path opacity=".7" d="M59 97h16m10 0h16" stroke="var(--ke-icon)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="m78 94 4 6m0-6-4 6" stroke="var(--ke-icon)" strokeWidth="1.2" />
      </>}
      {state === 'accessDenied' && <>
        <g filter={shadow}>{windowFrame(24, 22, 112, 78)}
          {/* Remix lock-line geometry, split so the shackle can close into the body. */}
          <g className="ke-icon ke-icon-lock" transform="translate(69 52) scale(.9166667)" fill="var(--ke-icon)">
            <path className="ke-motion ke-shackle" d="M5 11V9a7 7 0 0 1 14 0v2h-2V9a5 5 0 0 0-10 0v2H5Z" />
            <g className="ke-motion ke-lock-body">
              <path fillRule="evenodd" d="M4 10h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Zm1 2v8h14v-8H5Z" />
              <path className="ke-motion ke-keyhole" d="M11 14h2v4h-2z" />
            </g>
          </g>
          <Bar x={57} y={81} width={46} /><Bar x={65} y={89} width={30} />
        </g>
      </>}
      {state === 'sessionExpired' && <>
        <g filter={shadow}>{windowFrame(18, 22, 100, 78)}
          {/* Remix user-line: head and shoulders react separately as the session expires. */}
          <g className="ke-icon ke-icon-user" transform={`translate(57 50) scale(${22 / 24})`} fill="var(--ke-icon)">
            <path className="ke-motion ke-user-shoulders" d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4Z" />
            <path className="ke-motion ke-user-head" fillRule="evenodd" d="M12 1a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          </g>
          <Bar x={45} y={81} width={46} /><Bar x={53} y={89} width={30} />
        </g>
        <g filter={shadow}><circle cx="117" cy="94" r="13" fill={surface} stroke={border} />
          <g className="ke-motion ke-key"><Icon name="key-2" x={110} y={87} size={14} color="var(--ke-accent)" /></g>
        </g>
      </>}
      {state === 'noNotifications' && <>
        <rect x="36" y="18" width="88" height="72" rx="11" fill="var(--ke-back)" stroke={border} />
        <g filter={shadow}><rect x="27" y="24" width="106" height="77" rx="12" fill={surface} stroke={border} />
          <Bar x={38} y={34} width={42} heading /><path d="M28 47h104" stroke={border} />
          <BellIcon />
          <Bar x={56} y={80} width={48} /><Bar x={65} y={89} width={30} />
        </g>
      </>}
    </g>
  </svg>
}

/* Remix Icon v4.6.0 license (applies to the embedded icon paths only):
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
