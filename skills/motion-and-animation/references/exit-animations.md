# Exit Animations — Implementation Patterns

Exit animations are the hardest part of web animation. The element needs to play a "close" animation before the DOM unmounts — but by default, React removes elements immediately. This file covers the three main approaches: Radix `forceMount`, Chakra `defineAnimationStyles`, and Framer Motion `AnimatePresence`.

---

## The Core Problem

```
Mount  →  Enter animation plays  →  Stays visible
                                         ↓
                                    User closes
                                         ↓
                                    Exit animation should play
                                         ↓
                                    THEN unmount
```

Without special handling, "user closes" → immediate unmount. No exit animation.

---

## Pattern 1: Radix `forceMount` + CSS `data-state`

Radix UI components expose a `forceMount` prop on their content panels. When set, the content stays in the DOM even when logically closed. CSS transitions driven by `data-state="open"` and `data-state="closed"` attributes handle the visual enter/exit.

### Animation Lifecycle

```
open=true  → data-state="open"   → CSS enter animation plays
open=false → data-state="closed" → CSS exit animation plays → you control unmount timing
```

### Basic CSS Pattern

```css
/* Dialog Content with forceMount */
[data-state="open"] {
  animation: dialogEnter 250ms ease-out;
}

[data-state="closed"] {
  animation: dialogExit 200ms ease-in;
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dialogExit {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
}
```

### Overlay/Backdrop Pattern

```css
/* Backdrop fades separately from content */
.DialogOverlay[data-state="open"] {
  animation: overlayEnter 300ms ease-out;
}

.DialogOverlay[data-state="closed"] {
  animation: overlayExit 200ms ease-in;
}

@keyframes overlayEnter {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes overlayExit {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

### Directional Slide Patterns

```css
/* Slide from right (drawer) */
[data-state="open"]  { animation: slideInFromRight 250ms cubic-bezier(0.16, 1, 0.3, 1); }
[data-state="closed"]{ animation: slideOutToRight 200ms ease-in; }

@keyframes slideInFromRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes slideOutToRight {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}

/* Slide from bottom (mobile sheet) */
[data-state="open"]  { animation: slideInFromBottom 300ms cubic-bezier(0.16, 1, 0.3, 1); }
[data-state="closed"]{ animation: slideOutToBottom 200ms ease-in; }

@keyframes slideInFromBottom {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
@keyframes slideOutToBottom {
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
}
```

### Complete Dialog Example (Radix + Tailwind)

```tsx
import * as Dialog from '@radix-ui/react-dialog'
import './dialog-animations.css'  // contains the keyframes above

function AnimatedDialog({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* forceMount keeps both in DOM during close animation */}
        <Dialog.Overlay forceMount className="DialogOverlay" />
        <Dialog.Content forceMount className="DialogContent">
          {children}
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Important:** With `forceMount`, the dialog always renders in the DOM even when `open=false`. This is intentional — it allows the CSS exit animation to play. If this is a performance concern (e.g., large dialog trees), you can track animation completion with an `animationend` listener and remove the component from a parent state after exit completes.

---

## Pattern 2: Chakra UI `defineAnimationStyles`

Chakra's animation system uses CSS variable injection to make animation properties configurable at the call site. You define animations once, then compose and override at the component level.

### Basic `defineAnimationStyles`

```typescript
import { defineAnimationStyles } from '@chakra-ui/react'

export const animationStyles = defineAnimationStyles({
  // Simple fade
  'fade-in': {
    value: {
      animationName: 'fade-in',
      animationDuration: '0.3s',
      animationTimingFunction: 'ease-out',
    },
  },
  'fade-out': {
    value: {
      animationName: 'fade-out',
      animationDuration: '0.2s',
      animationTimingFunction: 'ease-in',
    },
  },

  // Slide and fade combined
  'slide-fade-in': {
    value: {
      animationName: 'slide-fade-in',
      animationDuration: '0.3s',
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  'slide-fade-out': {
    value: {
      animationName: 'slide-fade-out',
      animationDuration: '0.2s',
      animationTimingFunction: 'ease-in',
    },
  },
})
```

### CSS Variable-Driven Directional Animations

The power of Chakra's system: use CSS variables so the same keyframe works for all 4 directions.

```css
/* Single keyframe, direction controlled by CSS variable */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translate(var(--slide-from-x, 0), var(--slide-from-y, 0));
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    transform: translate(var(--slide-to-x, 0), var(--slide-to-y, 0));
  }
}
```

```typescript
// Usage: vary the direction at the component level
<Box
  css={{
    '--slide-from-x': '-20px',
    '--slide-from-y': '0',
    animationStyle: 'slide-in',
  }}
>
  Slides in from left
</Box>

<Box
  css={{
    '--slide-from-x': '0',
    '--slide-from-y': '20px',
    animationStyle: 'slide-in',
  }}
>
  Slides in from bottom
</Box>
```

### Composed Animations (parallel tracks)

Chakra supports composing multiple animation keyframes to run simultaneously:

```typescript
// Slide + scale + fade, all running together
export const animationStyles = defineAnimationStyles({
  'dialog-enter': {
    value: {
      animationName: 'slide-from-top, scale-in, fade-in',
      animationDuration: '0.3s, 0.3s, 0.2s',
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
})
```

---

## Pattern 3: Framer Motion `AnimatePresence`

Framer Motion's `AnimatePresence` tracks when children are removed from the React tree and delays unmounting until the exit animation completes. No `forceMount` required — Framer handles the lifecycle automatically.

### Basic Usage

```tsx
import { AnimatePresence, motion } from 'framer-motion'

function ToastContainer({ toasts }) {
  return (
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {toast.message}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

**Key rule:** Every direct child of `AnimatePresence` must have a unique `key`. This is how Framer tracks which elements have been removed.

### Modal with AnimatePresence

```tsx
function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          {/* Modal content */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### `mode` Prop for Sequential Transitions

```tsx
// Default: enter and exit play simultaneously
<AnimatePresence>...</AnimatePresence>

// 'wait': old component exits completely before new one enters
<AnimatePresence mode="wait">
  <motion.div key={currentPage}>
    {/* Page content */}
  </motion.div>
</AnimatePresence>

// 'popLayout': exiting component gets "popped" out of layout flow
<AnimatePresence mode="popLayout">...</AnimatePresence>
```

`mode="wait"` is correct for page transitions. `mode="popLayout"` is correct for list item removal where surrounding items should reflow immediately.

---

## Staggered Reveals

Stagger is the technique of introducing a small delay between each element in a group, creating a cascade effect rather than a simultaneous reveal.

### CSS Stagger (no JS, uses animation-delay)

```css
.stagger-list > * {
  animation: fadeSlideIn 0.3s ease-out both;
}

/* Stagger each child with increasing delay */
.stagger-list > *:nth-child(1) { animation-delay: 0ms; }
.stagger-list > *:nth-child(2) { animation-delay: 50ms; }
.stagger-list > *:nth-child(3) { animation-delay: 100ms; }
.stagger-list > *:nth-child(4) { animation-delay: 150ms; }
.stagger-list > *:nth-child(5) { animation-delay: 200ms; }

/* Use animation-fill-mode: both to hold initial state before delay fires */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### JS Stagger with inline style

```tsx
function StaggeredList({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item.id}
          style={{ animationDelay: `${i * 50}ms` }}
          className="animate-fade-slide-in"  // Tailwind custom animation
        >
          {item.content}
        </li>
      ))}
    </ul>
  )
}
```

### Framer Motion Stagger with `variants`

```tsx
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,   // 60ms between each child
      delayChildren: 0.1,      // wait 100ms before first child starts
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,   // exit stagger faster than enter
      staggerDirection: -1,    // exit in reverse order
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function StaggeredList({ items }) {
  return (
    <AnimatePresence>
      <motion.ul variants={containerVariants} initial="hidden" animate="show" exit="exit">
        {items.map(item => (
          <motion.li key={item.id} variants={itemVariants}>
            {item.content}
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  )
}
```

**Stagger timing guidance:**
- List items: 40-60ms between items
- Grid cards: 60-80ms between items
- Maximum stagger delay for last item: ~400ms total (8 items × 50ms)
- Beyond 400ms total, users perceive it as slow, not elegant
