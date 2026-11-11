'use client'

import { Button, type ButtonProps } from './button'

export type BellButtonProps = Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'variant'> & {
  variant?: 'primary' | 'secondary' | 'outline'
  pressed?: boolean
  muted?: boolean
  count?: number
}

const countFormatter = new Intl.NumberFormat('en-US')
const swingFrames = Array.from({ length: 61 }, (_, index) => {
  const time = index / 60
  // Three oscillations with exponential damping, sampled for linear playback.
  const angle = -29 * Math.exp(-4.2 * time) * Math.sin(6 * Math.PI * time)
  return { transform: index === 60 ? 'rotate(0deg)' : `rotate(${angle}deg)` }
})

export function BellButton({
  children,
  pressed,
  muted = false,
  count,
  variant = pressed ? 'primary' : 'secondary',
  size = 'md',
  isLoading = false,
  loadingText = 'Saving…',
  disabled,
  className,
  onPointerEnter,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-busy': ariaBusy,
  ...props
}: BellButtonProps) {
  const iconOnly = size === 'icon'
  const showCount = !iconOnly && !isLoading && count != null && Number.isSafeInteger(count) && count >= 0
  const iconColor = variant === 'outline' ? 'text-[color:light-dark(#25549c,#adc8ec)]' : ''
  const bell = (
    <span className={`relative inline-flex shrink-0 items-center justify-center align-middle ${size === 'lg' ? 'size-5' : 'size-[18px]'} ${iconColor}`}>
      {isLoading && <span className="absolute -inset-[3px] rounded-full border border-current border-e-transparent border-s-transparent opacity-55 motion-safe:animate-spin motion-safe:[animation-duration:1250ms]" />}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        data-bell-swing=""
        className={`${isLoading ? 'size-[82%]' : 'size-full'} origin-[50%_16.67%] ${muted ? 'opacity-55' : ''}`}
      >
        <path d="M10 20a2.25 2.25 0 0 0 4 0M12 3v1" />
        {muted ? (
          <path d="m3 3 18 18M9 5a6.5 6.5 0 0 1 9.5 5.8v3.7M5.5 10v3.3c0 1.3-.6 2.5-1.6 3.4-.5.5-.2 1.3.5 1.3h13.5" />
        ) : (
          <path d="M5.5 10.5a6.5 6.5 0 0 1 13 0v2.8c0 1.3.6 2.5 1.6 3.4.5.5.2 1.3-.5 1.3H4.4c-.7 0-1-.8-.5-1.3 1-.9 1.6-2.1 1.6-3.4z" />
        )}
      </svg>
    </span>
  )

  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      disabled={disabled || isLoading}
      aria-busy={isLoading || ariaBusy}
      aria-pressed={pressed ?? props['aria-pressed']}
      aria-label={ariaLabel ?? (iconOnly && !ariaLabelledBy ? 'Notifications' : undefined)}
      aria-labelledby={ariaLabelledBy}
      leftIcon={iconOnly ? undefined : bell}
      onPointerEnter={event => {
        onPointerEnter?.(event)
        if (event.defaultPrevented || event.currentTarget.disabled || event.pointerType === 'touch' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const icon = event.currentTarget.querySelector<SVGSVGElement>('svg[data-bell-swing]')
        if (icon && !icon.getAnimations().some(animation => animation.id === 'bell-swing' && animation.playState === 'running')) {
          icon.animate(swingFrames, { id: 'bell-swing', duration: 1320 })
        }
      }}
      className={isLoading ? ['disabled:cursor-wait! disabled:opacity-100!', className].filter(Boolean).join(' ') : className}
    >
      {iconOnly ? bell : (
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{isLoading ? loadingText : children ?? (pressed ? 'Following' : 'Notify me')}</span>
          {showCount && <span className="rounded-full bg-current/10 px-1.5 py-0.5 text-[0.8em] leading-none tabular-nums">{countFormatter.format(count)}</span>}
        </span>
      )}
    </Button>
  )
}
