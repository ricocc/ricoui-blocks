import type { ComponentPropsWithRef, ReactNode } from 'react'

const variants = {
  primary: `
    [--rb-top:light-dark(#3474c8,#c0d7f1)] [--rb-face:light-dark(#1957b7,#8baed3)]
    [--rb-edge:light-dark(#174da3,#7b9dc2)] [--rb-base:light-dark(#12458e,#496888)]
    text-[color:light-dark(#fff,#13263c)]
  `,
  secondary: `
    [--rb-top:light-dark(#f0f5ff,#3b5470)] [--rb-face:light-dark(#dbe7fb,#293e56)]
    [--rb-edge:light-dark(#9bb6e0,#607e9e)] [--rb-base:light-dark(#a7c0e3,#1b2b3e)]
    [--rb-dot:light-dark(#6592d070,#a3c4ed70)] text-[color:light-dark(#194c9d,#e3efff)]
  `,
  outline: `
    [--rb-top:light-dark(#fdfdff,#344351)] [--rb-face:light-dark(#eef2f9,#252f3a)]
    [--rb-edge:light-dark(#9baecb,#687c91)] [--rb-base:light-dark(#b5c3d8,#17212b)]
    [--rb-dot:light-dark(#7896bf70,#9bb1cd70)] text-[color:light-dark(#1c263b,#eef3fc)]
  `,
  ghost: `
    [--rb-top:transparent] [--rb-face:transparent] [--rb-edge:transparent]
    [--rb-base:transparent] [--rb-gloss:transparent] [--rb-shadow:transparent] before:hidden
    enabled:hover:[--rb-top:light-dark(#f2f6fd,#2b4054)] enabled:hover:[--rb-face:light-dark(#eaf1fc,#253747)]
    text-[color:light-dark(#25549c,#adc8ec)]
  `,
  destructive: `
    [--rb-top:light-dark(#b83d45,#f8b7ba)] [--rb-face:light-dark(#96272f,#df8d95)]
    [--rb-edge:light-dark(#8b222b,#bd777f)] [--rb-base:light-dark(#771d25,#81434b)]
    text-[color:light-dark(#fff,#421919)]
  `,
  success: `
    [--rb-top:light-dark(#26815a,#a3e4c2)] [--rb-face:light-dark(#115739,#71c19a)]
    [--rb-edge:light-dark(#0c5637,#60a481)] [--rb-base:light-dark(#0b432d,#32644e)]
    text-[color:light-dark(#fff,#123523)]
  `,
}

const sizes = {
  sm: 'min-h-8 px-3 py-1 text-xs',
  md: 'min-h-10 px-4 py-1.5 text-sm',
  lg: 'min-h-11 px-5 py-2 text-base',
  icon: 'size-10 p-0 text-sm',
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  theme?: 'light' | 'dark' | 'inherit'
  isLoading?: boolean
  loadingText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  theme = 'inherit',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className,
  style,
  type = 'button',
  'aria-busy': ariaBusy,
  ...props
}: ButtonProps) {
  const iconOnly = size === 'icon'
  const spinner = <span aria-hidden="true" className="size-[1.125em] shrink-0 rounded-full border-2 border-current border-e-transparent motion-safe:animate-spin" />

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || ariaBusy}
      style={{ colorScheme: theme, ...style }}
      className={[
        'relative isolate inline-flex items-center justify-center gap-2 rounded-[10px] border border-transparent font-semibold forced-colors:[border-color:ButtonText]',
        '[--rb-gloss:light-dark(#ffffff36,#ffffff26)] [--rb-dot:#ffffff60] [--rb-shadow:light-dark(#1b396c24,#0005)]',
        '[--rb-fill:var(--rb-face)] bg-[color:var(--rb-fill)] [background-origin:padding-box,border-box] [background-clip:padding-box,border-box]',
        // Separate the face and rim so the one-pixel edge can shade independently.
        '[background-image:linear-gradient(150deg,var(--rb-top),var(--rb-fill)),linear-gradient(145deg,color-mix(in_srgb,var(--rb-edge),var(--rb-top)_38%),var(--rb-edge)_50%,color-mix(in_srgb,var(--rb-edge),var(--rb-base)_44%))]',
        '[box-shadow:inset_0_1px_0_var(--rb-gloss),inset_0_-1px_0_color-mix(in_srgb,var(--rb-base),transparent_70%),0_3px_0_var(--rb-base),0_6px_10px_var(--rb-shadow)]',
        // Fade the dot grid into opposite corners so it stays clear of the label.
        'before:pointer-events-none before:absolute before:inset-px before:-z-10 before:rounded-[inherit]',
        'before:[background-image:radial-gradient(circle,var(--rb-dot)_0.55px,transparent_0.85px)] before:[background-size:3px_3px]',
        'before:[mask-image:radial-gradient(ellipse_38px_18px_at_top_left,#000,transparent),radial-gradient(ellipse_32px_18px_at_bottom_right,#000,transparent)] forced-colors:before:hidden',
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:light-dark(#2d6dc3,#a4bed9)]',
        'enabled:hover:[--rb-fill:color-mix(in_srgb,var(--rb-face),light-dark(#071b34,#d8edff)_12%)]',
        'enabled:active:[box-shadow:inset_0_1px_2px_var(--rb-base)] motion-safe:enabled:active:translate-y-[3px]',
        'motion-safe:transition-[background-color,box-shadow,translate] motion-safe:duration-150',
        isLoading ? 'disabled:cursor-wait' : 'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      ].filter(Boolean).join(' ')}
    >
      {isLoading ? spinner : leftIcon != null && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span className={isLoading && iconOnly ? 'sr-only' : 'min-w-0 [overflow-wrap:anywhere]'}>
        {isLoading && !iconOnly ? loadingText ?? children : children}
      </span>
      {!isLoading && rightIcon != null && <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>}
    </button>
  )
}
