# Recipe Patterns Reference

Chakra recipe and slot-recipe patterns, CVA integration, compound variants, atomic vs config recipes, and TypeScript-safe variant props. Synthesized from Chakra UI v3 source.

---

## What is a Recipe?

A recipe is a declarative configuration object that describes how a component should look across its variants. It replaces scattered conditional class logic with a structured, type-safe definition.

The pattern is equivalent to CVA but integrated into Chakra's token system — recipes reference design tokens directly and generate CSS variables + class names together.

---

## Chakra Recipe — Core Structure

```ts
import { defineRecipe } from '@chakra-ui/react'

const buttonRecipe = defineRecipe({
  // Always-applied base styles
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    fontWeight: 'semibold',
    borderRadius: 'md',
    cursor: 'pointer',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'colorPalette.500',
      outlineOffset: '2px',
    },
  },

  // Variant dimensions
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.500',
        color: 'white',
        _hover: { bg: 'colorPalette.600' },
        _active: { bg: 'colorPalette.700' },
      },
      outline: {
        bg: 'transparent',
        borderWidth: '1px',
        borderColor: 'colorPalette.500',
        color: 'colorPalette.500',
        _hover: { bg: 'colorPalette.50' },
      },
      ghost: {
        bg: 'transparent',
        color: 'colorPalette.500',
        _hover: { bg: 'colorPalette.50' },
      },
      subtle: {
        bg: 'colorPalette.100',
        color: 'colorPalette.800',
        _hover: { bg: 'colorPalette.200' },
      },
    },
    size: {
      xs: { h: '6',  px: '2', fontSize: 'xs' },
      sm: { h: '8',  px: '3', fontSize: 'sm' },
      md: { h: '10', px: '4', fontSize: 'md' },
      lg: { h: '12', px: '6', fontSize: 'lg' },
    },
  },

  // Default values per dimension
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },

  // Compound variants — fires when specific combination matches
  compoundVariants: [
    {
      variant: 'outline',
      size: 'lg',
      css: { borderWidth: '2px' },  // thicker border on large outline
    },
  ],
})
```

**`colorPalette`** is a Chakra convention — it's a placeholder resolved at runtime from the component's `colorPalette` prop:
```tsx
<Button colorPalette="blue">  → colorPalette.500 resolves to blue.500
<Button colorPalette="red">   → colorPalette.500 resolves to red.500
```

---

## Slot Recipe — Multi-Part Components

A slot recipe coordinates styles across multiple related elements within a compound component (e.g., Card with header, body, footer).

```ts
import { defineSlotRecipe } from '@chakra-ui/react'

const cardRecipe = defineSlotRecipe({
  className: 'card',  // CSS class prefix

  // Named slots — each is styled independently
  slots: ['root', 'header', 'body', 'footer'],

  // Base styles per slot
  base: {
    root: {
      bg: 'bg.surface',
      borderRadius: 'lg',
      borderWidth: '1px',
      borderColor: 'border.default',
      overflow: 'hidden',
    },
    header: {
      px: '6',
      pt: '6',
      pb: '2',
      borderBottomWidth: '1px',
      borderColor: 'border.default',
    },
    body: {
      px: '6',
      py: '4',
    },
    footer: {
      px: '6',
      pb: '6',
      pt: '2',
      display: 'flex',
      gap: '3',
      justifyContent: 'flex-end',
    },
  },

  variants: {
    variant: {
      elevated: {
        root: {
          boxShadow: 'md',
          borderWidth: '0',
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          boxShadow: 'none',
        },
      },
      filled: {
        root: {
          bg: 'bg.subtle',
          borderWidth: '0',
        },
      },
    },
    size: {
      sm: {
        root: { borderRadius: 'md' },
        header: { px: '4', pt: '4', pb: '2' },
        body: { px: '4', py: '3' },
        footer: { px: '4', pb: '4', pt: '2' },
      },
      lg: {
        root: { borderRadius: 'xl' },
        header: { px: '8', pt: '8', pb: '3' },
        body: { px: '8', py: '6' },
        footer: { px: '8', pb: '8', pt: '3' },
      },
    },
  },

  defaultVariants: {
    variant: 'elevated',
    size: 'md',
  },
})
```

**Using slot recipe in components:**
```tsx
import { cardRecipe } from './card.recipe'

function Card({ variant, size, children }) {
  const styles = cardRecipe({ variant, size })

  return (
    <div className={styles.root}>
      {children}
    </div>
  )
}

function CardHeader({ children }) {
  const styles = cardRecipe({})  // or use context
  return <div className={styles.header}>{children}</div>
}
```

Or with Chakra's built-in context propagation:
```tsx
const { withProvider, withContext } = createSlotRecipeContext(cardRecipe)

const Card     = withProvider('div', 'root')
const CardHeader = withContext('div', 'header')
const CardBody   = withContext('div', 'body')
const CardFooter = withContext('div', 'footer')
```

---

## CVA Integration

CVA is the framework-agnostic equivalent of Chakra recipes. The concepts map directly:

| Chakra Recipe | CVA Equivalent |
|---------------|----------------|
| `base` | First argument to `cva()` |
| `variants` | `variants` option |
| `defaultVariants` | `defaultVariants` option |
| `compoundVariants` | `compoundVariants` option |
| `defineSlotRecipe` | `cva()` per slot, coordinated via context |
| `colorPalette` | No equivalent — use CSS vars directly |

```ts
// Chakra recipe → CVA translation
import { cva } from 'class-variance-authority'

// Base styles = cva's first argument
// variants/defaultVariants/compoundVariants = cva's second argument (options)

const buttonVariants = cva(
  // base
  'inline-flex items-center justify-center gap-2 font-semibold rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        solid:   'bg-[var(--color-palette-500)] text-white hover:bg-[var(--color-palette-600)]',
        outline: 'bg-transparent border border-[var(--color-palette-500)] text-[var(--color-palette-500)]',
        ghost:   'bg-transparent text-[var(--color-palette-500)] hover:bg-[var(--color-palette-50)]',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    compoundVariants: [
      { variant: 'outline', size: 'lg', className: 'border-2' },
    ],
    defaultVariants: { variant: 'solid', size: 'md' },
  }
)
```

---

## Compound Variants — Real Examples

```ts
const inputRecipe = defineRecipe({
  base: {
    width: 'full',
    borderRadius: 'md',
    transitionProperty: 'colors',
    _focus: { outline: 'none', boxShadow: 'none' },
    _focusVisible: {
      borderColor: 'colorPalette.500',
      boxShadow: '0 0 0 1px var(--color-palette-500)',
    },
    _invalid: {
      borderColor: 'red.500',
      _focusVisible: { boxShadow: '0 0 0 1px token(colors.red.500)' },
    },
  },
  variants: {
    variant: {
      outline: {
        borderWidth: '1px',
        borderColor: 'border.default',
        bg: 'transparent',
        _hover: { borderColor: 'border.emphasized' },
      },
      filled: {
        bg: 'bg.subtle',
        borderWidth: '1px',
        borderColor: 'transparent',
        _hover: { bg: 'bg.muted' },
        _focusVisible: { bg: 'transparent', borderColor: 'colorPalette.500' },
      },
    },
    size: {
      sm: { h: '8',  px: '2', fontSize: 'sm' },
      md: { h: '10', px: '3', fontSize: 'md' },
      lg: { h: '12', px: '4', fontSize: 'lg' },
    },
  },
  compoundVariants: [
    // filled + sm gets reduced padding (already compact)
    {
      variant: 'filled',
      size: 'sm',
      css: { px: '2', _focusVisible: { ring: '1px' } },
    },
    // outline + lg gets heavier border on focus
    {
      variant: 'outline',
      size: 'lg',
      css: { _focusVisible: { boxShadow: '0 0 0 2px var(--color-palette-500)' } },
    },
  ],
  defaultVariants: { variant: 'outline', size: 'md' },
})
```

---

## Config Recipes vs Atomic Recipes

**Config Recipes** (Chakra default): Defined in the theme config. Styles generated upfront at build/setup time. Best for established, reusable components.

```ts
// In createSystem / theme config:
const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      card: cardRecipe,
      modal: modalRecipe,
    }
  }
})
```

**Atomic Recipes** (Just-in-Time): Defined inline, styles generated on-demand from atomic CSS classes. Best for one-off component variations.

```tsx
// Inline, not registered in theme
import { defineRecipe } from '@chakra-ui/react'

const mySpecialBadge = defineRecipe({
  base: { px: '2', py: '0.5', borderRadius: 'full', fontSize: 'xs' },
  variants: { color: { green: { bg: 'green.100', color: 'green.800' } } },
})

// Used directly with useRecipe or styled()
const BadgeRoot = styled('span', mySpecialBadge)
```

**Trade-offs:**
| | Config Recipes | Atomic Recipes |
|--|---------------|----------------|
| CSS generation | Upfront, predictable | On-demand, smaller |
| Theme integration | Full (colorPalette, tokens) | Limited |
| Type safety | Full via `RecipeVariantProps` | Manual |
| Best for | Design system components | One-off or dynamic |

---

## TypeScript Integration

```ts
import { type RecipeVariantProps } from '@chakra-ui/react'
import { buttonRecipe } from './button.recipe'

// Extract variant prop types from recipe
type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
// → { variant?: 'solid' | 'outline' | 'ghost' | 'subtle', size?: 'xs' | 'sm' | 'md' | 'lg' }

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  loading?: boolean
  loadingText?: string
}

// For slot recipes:
import { type SlotRecipeVariantProps } from '@chakra-ui/react'
import { cardRecipe } from './card.recipe'

type CardVariants = SlotRecipeVariantProps<typeof cardRecipe>
// → { variant?: 'elevated' | 'outline' | 'filled', size?: 'sm' | 'md' | 'lg' }
```

---

## Full Example: Badge with Recipe

```ts
// badge.recipe.ts
import { defineRecipe } from '@chakra-ui/react'

export const badgeRecipe = defineRecipe({
  className: 'badge',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    fontWeight: 'medium',
    borderRadius: 'full',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.500',
        color: 'white',
      },
      subtle: {
        bg: 'colorPalette.100',
        color: 'colorPalette.800',
      },
      outline: {
        bg: 'transparent',
        borderWidth: '1px',
        borderColor: 'colorPalette.400',
        color: 'colorPalette.700',
      },
      surface: {
        bg: 'colorPalette.50',
        borderWidth: '1px',
        borderColor: 'colorPalette.200',
        color: 'colorPalette.700',
      },
    },
    size: {
      sm: { px: '1.5', py: '0', fontSize: '2xs', h: '4' },
      md: { px: '2',   py: '0.5', fontSize: 'xs', h: '5' },
      lg: { px: '2.5', py: '1',   fontSize: 'sm', h: '6' },
    },
  },
  defaultVariants: {
    variant: 'subtle',
    size: 'md',
  },
  compoundVariants: [
    // Solid large badges get slightly heavier text
    {
      variant: 'solid',
      size: 'lg',
      css: { fontWeight: 'semibold' },
    },
  ],
})
```

```tsx
// badge.tsx
import { styled } from '@chakra-ui/react'
import { badgeRecipe } from './badge.recipe'

export const Badge = styled('span', badgeRecipe)

// Usage
<Badge colorPalette="green" variant="subtle" size="sm">Active</Badge>
<Badge colorPalette="red" variant="solid">Error</Badge>
```

---

## Pattern: Shared Recipe Base

When multiple components share similar base styles, extract the common recipe config:

```ts
// shared.recipe.ts — common interactive element base
export const interactiveBase = {
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.15s ease',
  _disabled: { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' },
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'colorPalette.500',
    outlineOffset: '2px',
  },
}

// button.recipe.ts — extends shared base
export const buttonRecipe = defineRecipe({
  base: {
    ...interactiveBase,
    display: 'inline-flex',
    alignItems: 'center',
    // button-specific additions...
  },
  // ...
})

// tab.recipe.ts — same shared base
export const tabRecipe = defineRecipe({
  base: {
    ...interactiveBase,
    borderBottomWidth: '2px',
    // tab-specific additions...
  },
  // ...
})
```
