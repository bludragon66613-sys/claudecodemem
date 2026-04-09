# Compound Components Reference

Patterns for building accessible, composable UI using Root/Trigger/Content decomposition. Synthesized from Radix UI source.

---

## Root/Trigger/Content Decomposition

Every interactive Radix primitive follows a three-part anatomy:

```tsx
// Dialog — canonical example
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close asChild>
        <Button variant="ghost">Close</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Root** — owns state (open/closed, selected value). Provides context to descendants.
**Trigger** — user-facing element that changes state. Receives ARIA attributes automatically.
**Content** — conditionally rendered or hidden container. Receives focus on open.
**Portal** — optional escape from CSS stacking contexts. Renders into `document.body`.
**Close** — internal Trigger alias that calls `onOpenChange(false)`.

This decomposition lets consumers control layout without state management boilerplate.

---

## `asChild` — Polymorphic Rendering

The `asChild` prop delegates rendering to the consumer's child element instead of using the default element. No wrapper div is injected into the DOM.

```tsx
// WITHOUT asChild — renders: <button><a href="/dashboard">Go</a></button>
<Dialog.Trigger>
  <a href="/dashboard">Go</a>
</Dialog.Trigger>

// WITH asChild — renders: <a href="/dashboard" data-state="closed" aria-haspopup="dialog">Go</a>
<Dialog.Trigger asChild>
  <a href="/dashboard">Go</a>
</Dialog.Trigger>
```

`asChild` uses the Slot primitive to merge props (event handlers, aria attributes, data attributes) onto the child element. The child becomes the actual DOM element.

**Slot merge behavior:**
- Event handlers: both parent and child `onClick` fire (parent first)
- Class names: child class overrides parent class
- Other props: parent props applied to child element
- Refs: merged via callback ref

```tsx
// Implementing asChild in a custom primitive
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp ref={ref} {...props} />
  }
)
```

---

## Slot-Based Rendering

Slot renders its `children` by cloning them and merging the Slot's own props onto the child. If multiple children are passed, they must be wrapped in a `Slottable` fragment.

```tsx
// Slot with multiple children — use Slottable to mark which child receives merged props
import { Slot, Slottable } from '@radix-ui/react-slot'

const Button = ({ asChild, leftIcon, children, ...props }) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp {...props}>
      {leftIcon}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}

// Usage: renders <a href="..."><svg/> Click me </a>
<Button asChild leftIcon={<svg />}>
  <a href="/path">Click me</a>
</Button>
```

---

## Uncontrolled vs Controlled Hybrid State

Radix components support both patterns via a convention:
- **Uncontrolled**: `defaultValue` — initial value, component manages state internally
- **Controlled**: `value` + `onValueChange` — parent drives state
- **Neither**: component falls back to internal defaults

```tsx
// Uncontrolled — Accordion manages its own open state
<Accordion.Root type="single" defaultValue="item-1" collapsible>
  <Accordion.Item value="item-1">...</Accordion.Item>
</Accordion.Root>

// Controlled — parent drives state
const [value, setValue] = useState('item-1')
<Accordion.Root type="single" value={value} onValueChange={setValue}>
  <Accordion.Item value="item-1">...</Accordion.Item>
</Accordion.Root>

// Uncontrolled with callback — internal state, but notified of changes
<Accordion.Root type="single" defaultValue="item-1" onValueChange={(v) => console.log(v)}>
  <Accordion.Item value="item-1">...</Accordion.Item>
</Accordion.Root>
```

**Implementation pattern** using `useControllableState`:
```tsx
function useControllableState<T>({ prop, defaultProp, onChange }) {
  const [uncontrolledProp, setUncontrolledProp] = useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  const handleChange = useCallback((nextValue: T) => {
    if (!isControlled) setUncontrolledProp(nextValue)
    onChange?.(nextValue)
  }, [isControlled, onChange])

  return [value, handleChange] as const
}
```

---

## Data Attributes for State Styling

Radix injects `data-*` attributes reflecting component state. Style with CSS attribute selectors — no JS state tracking needed in CSS.

```tsx
// Components automatically receive these attributes:
// data-state="open" | "closed"
// data-disabled (presence, no value)
// data-highlighted (for menu items under keyboard focus)
// data-placeholder (for Select when no value selected)
// data-orientation="horizontal" | "vertical"
// data-side="top" | "right" | "bottom" | "left" (for positioned content)
```

```css
/* CSS-only state styling */
[data-state="open"] > .icon { transform: rotate(180deg); }
[data-disabled] { opacity: 0.5; pointer-events: none; }
[data-highlighted] { background: var(--accent); }

/* Tailwind data attribute variants */
<div className="data-[state=open]:animate-in data-[state=closed]:animate-out" />
```

```tsx
// Tailwind v4 with CVA
const accordionContent = cva(
  'overflow-hidden transition-all',
  {
    variants: {},
  }
)
// Direct data attribute targeting in Tailwind v4:
<AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up" />
```

---

## `forceMount` for Animation Support

By default, Radix unmounts Content when closed. `forceMount` keeps the DOM node present during exit animations — the exit animation would be skipped otherwise.

```tsx
// Without forceMount — content unmounts immediately on close, no exit animation
<Dialog.Content>...</Dialog.Content>

// With forceMount — content stays mounted, animate based on data-state
<Dialog.Content forceMount>
  <motion.div
    variants={{
      open: { opacity: 1, y: 0 },
      closed: { opacity: 0, y: -10 }
    }}
    initial="closed"
    animate="open"
    exit="closed"  // only works if content is still in DOM during exit
  >
    ...
  </motion.div>
</Dialog.Content>

// With Framer Motion AnimatePresence — forceMount + manual presence detection
<AnimatePresence>
  {open && (
    <Dialog.Content forceMount>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    </Dialog.Content>
  )}
</AnimatePresence>
```

---

## Full Compound Pattern: DropdownMenu

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="icon-button" aria-label="User menu">
          <Avatar />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown-content"
          sideOffset={8}
          align="end"
          onCloseAutoFocus={(e) => e.preventDefault()} // prevent focus jump
        >
          <DropdownMenu.Label>My Account</DropdownMenu.Label>

          <DropdownMenu.Item onSelect={() => router.push('/profile')}>
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Preferences</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.CheckboxItem
                checked={theme === 'dark'}
                onCheckedChange={() => toggleTheme()}
              >
                Dark Mode
                <DropdownMenu.ItemIndicator>
                  <CheckIcon />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            className="text-red-600"
            onSelect={() => signOut()}
          >
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

---

## Full Compound Pattern: Accordion

```tsx
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

const AccordionDemo = () => (
  <Accordion.Root
    type="single"
    defaultValue="item-1"
    collapsible
    className="w-full space-y-1"
  >
    {items.map(({ value, trigger, content }) => (
      <Accordion.Item
        key={value}
        value={value}
        className="border rounded-lg overflow-hidden"
      >
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 font-medium hover:underline [&[data-state=open]>svg]:rotate-180">
            {trigger}
            <ChevronDownIcon className="transition-transform duration-200" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
          <div className="px-4 pb-4 pt-0 text-sm">{content}</div>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
)
```

---

## Context Propagation Pattern

Compound components communicate through React Context, not prop drilling:

```tsx
// Root establishes context
const DialogContext = React.createContext<DialogContextValue | null>(null)

const DialogRoot = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useControllableState({
    prop: open,
    defaultProp: false,
    onChange: onOpenChange,
  })

  return (
    <DialogContext.Provider value={{ open: internalOpen, setOpen: setInternalOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

// Child consumes context — no props needed
const DialogTrigger = ({ asChild, children }) => {
  const { setOpen } = useContext(DialogContext)
  const Comp = asChild ? Slot : 'button'
  return <Comp onClick={() => setOpen(true)}>{children}</Comp>
}
```

This pattern scales to deeply nested sub-components without prop threading.
