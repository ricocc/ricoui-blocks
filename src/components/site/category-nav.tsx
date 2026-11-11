import { componentCategories, type ComponentCategory } from '../../data/components'

export type ComponentCategoryFilter = 'all' | ComponentCategory

type CategoryNavProps = {
  activeCategory?: ComponentCategoryFilter
  onSelect?: (category: ComponentCategoryFilter) => void
}

export function CategoryNav({
  activeCategory = 'all',
  onSelect,
}: CategoryNavProps) {
  const categories = [{ slug: 'all' as const, label: 'All' }, ...componentCategories]

  return (
    <nav aria-label="Component categories" className="overflow-x-auto">
      <ul className="flex min-w-max items-center gap-5 text-sm sm:gap-7">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug
          const classes = isActive
            ? 'font-medium text-[var(--foreground)]'
            : 'text-[var(--foreground-muted)]'

          return (
            <li key={category.slug}>
              {onSelect ? (
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelect(category.slug)}
                  className={`${classes} cursor-pointer transition-colors duration-200 hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--link)]`}
                >
                  {category.label}
                </button>
              ) : (
                <span aria-current={isActive ? 'page' : undefined} className={classes}>
                  {category.label}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
