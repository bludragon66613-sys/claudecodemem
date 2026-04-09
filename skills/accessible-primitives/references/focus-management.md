# Focus Management Reference

Focus trapping, roving tabindex, portal focus, dismiss callbacks, and focus restoration patterns. Synthesized from Radix UI, react-focus-lock, and WAI-ARIA Authoring Practices.

---

## Focus Trapping for Modals

When a modal dialog opens, keyboard focus must be contained within it. Background content must become unreachable.

### Native `inert` attribute (modern browsers)

```tsx
// Set inert on everything outside the dialog
useEffect(() => {
  if (!open) return
  const outside = document.querySelectorAll('body > *:not([data-dialog-root])')
  outside.forEach(el => el.setAttribute('inert', ''))
  return () => outside.forEach(el => el.removeAttribute('inert'))
}, [open])
```

`inert` prevents focus, pointer events, and removes elements from accessibility tree. Preferred over `aria-hidden` + `tabIndex=-1` patching.

### react-focus-lock (polyfill + extras)

```tsx
import FocusLock from 'react-focus-lock'

function Modal({ open, onClose, children }) {
  return open ? (
    <FocusLock
      returnFocus      // return focus to trigger on unmount
      autoFocus        // focus first focusable element on mount
      lockProps={{ 'aria-modal': true }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {children}
      </div>
    </FocusLock>
  ) : null
}
```

FocusLock intercepts Tab/Shift+Tab and cycles focus within the locked container. Works across Shadow DOM and portals.

### Radix built-in trapping

Radix Dialog handles trapping automatically. Use `onOpenAutoFocus` and `onCloseAutoFocus` to override default behavior:

```tsx
<Dialog.Content
  onOpenAutoFocus={(e) => {
    // Default: focus first focusable element
    // Override: focus specific element
    e.preventDefault()
    specificRef.current?.focus()
  }}
  onCloseAutoFocus={(e) => {
    // Default: return focus to trigger
    // Override: focus different element on close
    e.preventDefault()
    alternateRef.current?.focus()
  }}
>
```

---

## Roving Tabindex

For keyboard-navigated groups (toolbars, tab lists, radio groups, menus), only ONE element has `tabIndex=0` at a time. Arrow keys move focus between items.

This prevents the Tab key from cycling through every item in the group.

```tsx
function RovingTabGroup({ items }) {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let nextIndex = index

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (index + 1) % items.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (index - 1 + items.length) % items.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = items.length - 1
        break
      default:
        return
    }

    setFocusedIndex(nextIndex)
    itemRefs.current[nextIndex]?.focus()
  }

  return (
    <div role="toolbar" aria-label="Text formatting">
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={el => itemRefs.current[i] = el}
          tabIndex={i === focusedIndex ? 0 : -1}  // only one tab stop
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={() => setFocusedIndex(i)}       // sync when focused via click
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
```

**When to use roving tabindex:**
- Toolbars
- Tab lists
- Radio groups
- Menu items within a menu
- Tree items within a tree
- Grid cells within a grid

**When NOT to use:** regular form fields, navigation links, content — Tab should cycle normally.

---

## Portal Focus Management

Portals render into `document.body`, outside the normal React tree. Focus management requires explicit handling.

```tsx
// Without portal: focus moves naturally with DOM order
// With portal: focus jumps to body if not managed

import { createPortal } from 'react-dom'

function Popover({ triggerRef, open, children }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (open && contentRef.current) {
      // Save trigger reference before portal mounts
      previousFocus.current = triggerRef.current
      // Move focus into portal
      const firstFocusable = contentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    }
  }, [open])

  useEffect(() => {
    return () => {
      // Restore focus on unmount
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }, [])

  if (!open) return null

  return createPortal(
    <div ref={contentRef}>{children}</div>,
    document.body
  )
}
```

Radix handles this automatically via `onOpenAutoFocus`/`onCloseAutoFocus` hooks on Content components.

---

## Dismiss Callbacks

Radix dismissable layer provides granular control over dismiss interactions:

```tsx
<Dialog.Content
  // Pointer click outside dialog bounds
  onPointerDownOutside={(e) => {
    // e.preventDefault() to prevent dismiss
    if (isImportantTask) e.preventDefault()
  }}

  // Focus moves outside dialog (e.g., browser URL bar)
  onFocusOutside={(e) => {
    e.preventDefault() // prevent dismiss on focus outside
  }}

  // Escape key press
  onEscapeKeyDown={(e) => {
    // e.preventDefault() to prevent Escape from closing
    if (formIsDirty) {
      e.preventDefault()
      showConfirmLeaveDialog()
    }
  }}

  // Any interaction outside (combines pointer + focus)
  onInteractOutside={(e) => {
    // Fired before onPointerDownOutside and onFocusOutside
  }}
/>

// Popover — often want to stay open while interacting with external element
<Popover.Content
  onInteractOutside={(e) => {
    const target = e.target as HTMLElement
    if (colorPickerRef.current?.contains(target)) {
      e.preventDefault() // keep open while using external color picker
    }
  }}
/>
```

---

## Focus Restoration

When an overlay closes, focus MUST return to the element that opened it. This preserves the user's navigation position.

```tsx
// Pattern 1: Ref-based restoration (manual)
const triggerRef = useRef<HTMLButtonElement>(null)

function openModal() {
  setOpen(true)
  // triggerRef.current saved before open
}

function closeModal() {
  setOpen(false)
  // After state update, restore focus
  requestAnimationFrame(() => {
    triggerRef.current?.focus()
  })
}

// Pattern 2: Radix automatic restoration
<Dialog.Content
  onCloseAutoFocus={(e) => {
    // Default behavior: focus Dialog.Trigger automatically
    // No action needed unless overriding
  }}
/>

// Pattern 3: react-focus-lock returnFocus
<FocusLock returnFocus>
  <Modal />
</FocusLock>
// Automatically focuses previously focused element on unmount
```

**Edge cases:**
```tsx
// Trigger was removed from DOM while modal was open (e.g., list item deleted)
<Dialog.Content
  onCloseAutoFocus={(e) => {
    e.preventDefault() // suppress default
    // Focus next logical element instead
    const listContainer = document.querySelector('[data-list]')
    const firstItem = listContainer?.querySelector('[data-item]')
    firstItem?.focus() ?? document.body.focus()
  }}
/>
```

---

## Focus Ring Styling

Visible focus rings are required for keyboard accessibility (WCAG 2.4.7). Design them — don't suppress them.

```css
/* Never do this: */
*:focus { outline: none; }
button:focus { outline: 0; }

/* Minimal: show only for keyboard, not mouse/touch */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Hide for mouse/touch (focus without keyboard) */
:focus:not(:focus-visible) {
  outline: none;
}
```

```tsx
// Tailwind focus ring — standard pattern across shadcn
<button className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring      /* CSS var --ring */
  focus-visible:ring-offset-2
  focus-visible:ring-offset-background
">
```

```css
/* Custom high-visibility focus ring */
:root {
  --ring: 215 100% 50%;  /* HSL blue */
}

/* Dark mode: invert ring offset color */
.dark {
  --ring: 215 70% 65%;
  --background: 222 47% 11%;
}

/* Component-level override for specific context */
.on-dark-bg:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}
```

**Ring sizing:**
- 2px minimum, 4px for high-visibility / large targets
- `outline-offset: 2px` separates ring from element edge
- `ring-offset-background` matches page background for clean appearance

---

## Skip Navigation Links

Allow keyboard users to jump past repeated navigation:

```tsx
// First element in body — visible only on focus
function SkipNav() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-50
        focus:px-4
        focus:py-2
        focus:bg-background
        focus:text-foreground
        focus:rounded
        focus:shadow-lg
      "
    >
      Skip to main content
    </a>
  )
}

// Target
<main id="main-content" tabIndex={-1}>
  {/* tabIndex=-1: programmatically focusable, not in tab order */}
</main>
```

---

## Focus Within Detection

For styling containers that contain a focused element:

```css
/* CSS :focus-within — style parent when child is focused */
.input-group:focus-within {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}

.nav-item:focus-within > .nav-submenu {
  display: block; /* keep submenu open when navigating within */
}
```

```tsx
// React equivalent — track focus within a container
function useFocusWithin(ref: RefObject<HTMLElement>) {
  const [hasFocus, setHasFocus] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onFocusIn = () => setHasFocus(true)
    const onFocusOut = (e: FocusEvent) => {
      // Only fire if focus left the container entirely
      if (!el.contains(e.relatedTarget as Node)) {
        setHasFocus(false)
      }
    }

    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)
    return () => {
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [ref])

  return hasFocus
}
```

---

## Focusable Element Query

Standard selector for all natively focusable elements:

```ts
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'details > summary',
  'audio[controls]',
  'video[controls]',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(el => !el.closest('[inert]') && !el.closest('[aria-hidden="true"]'))
}

// First and last for trap cycling
function getTrapBoundaries(container: HTMLElement) {
  const focusable = getFocusableElements(container)
  return { first: focusable[0], last: focusable[focusable.length - 1] }
}
```
