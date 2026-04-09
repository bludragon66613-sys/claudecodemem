# CVA Variants Reference

Class Variance Authority (CVA) full API, `cn()` utility, variant composition, and real-world component examples. Synthesized from shadcn/ui source.

---

## CVA Core API

```ts
import { cva, type VariantProps } from 'class-variance-authority'

const component = cva(
  baseClasses,        // always-applied classes (string or string[])
  {
    variants: {},     // variant dimensions
    compoundVariants: [],  // conditional variants
    defaultVariants: {},   // fallback values per dimension
  }
)
```

`cva()` returns a function. Call it with variant props to get a class string:

```ts
const buttonClasses = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-input bg-background',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

// Usage
buttonClasses({ variant: 'outline', size: 'sm' })
// → "inline-flex items-center justify-center border border-input bg-background h-8 rounded-md px-3 text-xs"

buttonClasses({})  // uses defaultVariants
// → "inline-flex items-center justify-center bg-primary text-primary-foreground h-9 px-4 py-2"
```

---

## TypeScript Integration

`VariantProps` extracts the variant prop types directly from the CVA definition. No manual type duplication.

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-white shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// VariantProps extracts: { variant?: 'default' | 'destructive' | ..., size?: 'default' | 'sm' | ... }
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
```

Note: `className` is passed INTO `buttonVariants()`, not concatenated after — this lets `twMerge` inside `cn()` resolve conflicts between CVA classes and consumer overrides.

---

## `cn()` Utility — Deep Dive

```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`clsx` handles:** conditional classes, arrays, objects, falsy filtering
**`twMerge` handles:** Tailwind conflict resolution (last wins, intelligently)

```ts
// clsx alone
clsx('p-2', false && 'hidden', { 'text-red-500': isError })
// → "p-2 text-red-500"

// twMerge alone — resolves Tailwind conflicts
twMerge('px-2 py-1', 'p-3')   // → "p-3"       (shorthand overrides longhands)
twMerge('text-sm', 'text-lg')  // → "text-lg"   (last wins)
twMerge('mt-2', 'mt-4')        // → "mt-4"

// cn() = both combined
cn(
  'px-4 py-2 text-sm',
  isLarge && 'text-lg',       // conditionally overrides text-sm
  isFullWidth && 'w-full',
  className                   // consumer override wins
)
```

**When to pass `className` into CVA vs concatenate:**

```ts
// CORRECT: pass className into CVA so twMerge can resolve conflicts
cn(buttonVariants({ variant, size, className }))

// WRONG: appending after — twMerge can still resolve, but variant order wrong
cn(buttonVariants({ variant, size }), className)
// This works too, actually — both are valid. CVA passes className through.
```

---

## `defaultVariants`

Sets the fallback value for each variant dimension. Used when a variant prop is omitted or `undefined`:

```ts
const badge = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',  // <Badge /> is equivalent to <Badge variant="default" />
  },
})

badge({})               // → uses 'default'
badge({ variant: undefined })  // → uses 'default'
badge({ variant: null })       // → no variant classes applied (null bypasses default)
```

**`null` bypass:** Passing `null` explicitly skips the defaultVariant for that dimension. Useful when you want no variant class applied.

---

## `compoundVariants`

Applies additional classes when a specific COMBINATION of variants is active. Fires when ALL specified variants match simultaneously.

```ts
const button = cva('base-classes', {
  variants: {
    variant: { default: '...', outline: '...' },
    size: { sm: '...', lg: '...' },
    isLoading: { true: 'opacity-70 cursor-not-allowed' },
  },
  compoundVariants: [
    // Only when variant=outline AND size=lg
    {
      variant: 'outline',
      size: 'lg',
      className: 'border-2',  // thicker border for large outline buttons
    },
    // Only when isLoading=true AND variant=default
    {
      variant: 'default',
      isLoading: true,
      className: 'bg-primary/70',  // dimmed primary when loading
    },
    // Multiple values for same dimension (array syntax)
    {
      variant: ['outline', 'ghost'],
      size: 'sm',
      className: 'rounded-sm',
    },
  ],
  defaultVariants: { variant: 'default', size: 'default' },
})
```

**Order matters:** compoundVariants apply after regular variants. Later entries in the array override earlier ones.

---

## Full Example: Alert Component

```tsx
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning: 'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500',
        success: 'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
)

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
)
```

---

## Full Example: Input with States

```tsx
const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      inputSize: {
        default: 'h-9',
        sm: 'h-7 text-xs px-2',
        lg: 'h-11 text-base px-4',
      },
    },
    defaultVariants: {
      state: 'default',
      inputSize: 'default',
    },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, inputSize, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(inputVariants({ state, inputSize }), className)}
      {...props}
    />
  )
)
```

---

## Boolean Variants

CVA supports boolean variant dimensions:

```ts
const overlay = cva('fixed inset-0', {
  variants: {
    blur: {
      true: 'backdrop-blur-sm',
      false: '',
    },
    dark: {
      true: 'bg-black/50',
      false: 'bg-black/20',
    },
  },
  defaultVariants: { blur: false, dark: false },
})

// Usage: props map naturally to boolean
<Overlay blur dark />   // → blur={true} dark={true}
```

---

## CVA vs Plain Template Literals

```ts
// Without CVA — brittle, hard to extend, no type safety
function getButtonClass(variant: string, size: string) {
  return `btn ${variant === 'outline' ? 'btn-outline' : 'btn-default'} ${size === 'sm' ? 'btn-sm' : ''}`
}

// With CVA — declarative, type-safe, composable
const buttonVariants = cva('btn', {
  variants: {
    variant: { default: 'btn-default', outline: 'btn-outline' },
    size: { default: '', sm: 'btn-sm' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

Use CVA whenever a component has more than one variant dimension. Single-dimension conditional classes don't need it.
