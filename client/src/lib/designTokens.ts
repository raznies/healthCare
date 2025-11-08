/**
 * Design Tokens
 * Centralized design system tokens for consistent UI
 */

export const spacing = {
  section: {
    hero: 'py-20 lg:py-24',
    content: 'py-16',
    dashboard: 'py-8',
  },
  container: {
    wide: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  card: {
    default: 'p-6',
    compact: 'p-4 md:p-6',
    header: 'p-6',
    content: 'p-6 pt-0',
  },
  grid: {
    section: 'gap-12',
    cards: 'gap-6',
    items: 'gap-4',
  },
  stack: {
    section: 'space-y-8',
    form: 'space-y-6',
    list: 'space-y-4',
    tight: 'space-y-3',
    field: 'space-y-2',
  },
} as const;

export const responsive = {
  stats: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  twoCol: 'grid grid-cols-1 lg:grid-cols-2',
  threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  formGrid: 'grid grid-cols-1 md:grid-cols-2',
} as const;

export const borderRadius = {
  card: 'rounded-lg',
  button: 'rounded-md',
  badge: 'rounded-full',
  input: 'rounded-md',
  image: 'rounded-lg',
  avatar: 'rounded-full',
} as const;

export const typography = {
  display: 'text-4xl lg:text-5xl font-bold',
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body: 'text-base leading-6',
  small: 'text-sm leading-5',
  label: 'text-sm font-medium',
} as const;

export const shadows = {
  card: 'shadow-sm',
  cardHover: 'hover:shadow-lg transition-shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  xxl: 'shadow-2xl',
} as const;

/**
 * Helper function to combine design tokens
 */
export function combine(...tokens: string[]): string {
  return tokens.join(' ');
}
