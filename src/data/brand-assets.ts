export const brandAssets = [
  { name: 'Original logo', file: 'logo.png', surface: 'light' },
  { name: 'White logo', file: 'logo-w.png', surface: 'dark' },
  { name: 'Dark logo', file: 'logo-dark.png', surface: 'light' },
  { name: 'Logo style 1', file: 'logo-style-1.png', surface: 'light' },
  { name: 'Logo style 2', file: 'logo-style-2.png', surface: 'light' },
  { name: 'Logo style 3', file: 'logo-style-3.png', surface: 'light' },
] as const

export const brandAssetUrl = (file: (typeof brandAssets)[number]['file']) => '/brands/' + file
