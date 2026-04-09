# Reduced Motion — Accessibility Implementation

Some users experience nausea, dizziness, or seizures from motion on screen. The `prefers-reduced-motion` media query lets them tell your app they need less motion. Honoring it is a WCAG requirement, not a nice-to-have.

---

## WCAG 2.1 — Success Criterion 2.3.3

**SC 2.3.3 Animation from Interactions (Level AAA):**
> "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed."

Level AAA means it's beyond minimum compliance, but practically speaking most teams should aim for it. Non-essential motion should be disableable. For animations that last more than 5 seconds, SC 2.2.2 (Pause, Stop, Hide) applies at Level A — meaning it's **required**.

**Rule of thumb:** If the motion is decorative or narrative, it must be respectable. If removing it prevents the user from understanding state (e.g., a loading spinner), it's essential.

---

## CSS Detection

### Basic Pattern

```css
/* Default: animations enabled */
.animated-element {
  transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 200ms ease-out;
}

/* Reduced motion: cut or replace animations */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: opacity 100ms ease-out;  /* keep fade, remove slide */
  }
}
```

### Global Instant-Off (Aggressive Approach)

```css
/* Apply to everything — zero motion fallback */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Warning:** `0.01ms` instead of `0ms` ensures CSS transitions still fire `transitionend` events, which some JS (like Radix UI) listens to for lifecycle management. Using `0ms` exactly can prevent `transitionend` from firing in some browsers, breaking components that depend on that event.

### Selective Approach (Preferred)

Rather than globally zeroing all animation, replace motion-based animations with opacity-only equivalents. This is more respectful — the user gets visual feedback without vestibular-triggering motion.

```css
/* Default: slide + fade */
@keyframes slide-fade-in {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* Reduced motion: fade only, no movement */
@media (prefers-reduced-motion: reduce) {
  @keyframes slide-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}
```

This overrides the keyframe definition itself. Any element using the `slide-fade-in` animation automatically gets the reduced version.

---

## JavaScript Detection

### One-Time Check

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // Skip animation, show final state immediately
} else {
  // Run full animation
}
```

### Listening for Changes at Runtime

Users can change their system accessibility settings without reloading the page. Listen for changes:

```javascript
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

function handleMotionPreferenceChange(event) {
  if (event.matches) {
    // User turned on reduced motion
    disableAnimations()
  } else {
    // User turned off reduced motion
    enableAnimations()
  }
}

// Modern API (addEventListener)
mediaQuery.addEventListener('change', handleMotionPreferenceChange)

// Cleanup (if in React useEffect)
return () => {
  mediaQuery.removeEventListener('change', handleMotionPreferenceChange)
}
```

### React Hook

```typescript
import { useState, useEffect } from 'react'

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: 'easeOut',
      }}
    >
      Content
    </motion.div>
  )
}
```

---

## Framer Motion `useReducedMotion`

Framer Motion ships a built-in hook that handles the media query and re-rendering:

```typescript
import { motion, useReducedMotion } from 'framer-motion'

function Dialog({ isOpen, children }) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: {
      opacity: 0,
      // Only apply y translation if motion is acceptable
      y: shouldReduceMotion ? 0 : -10,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isOpen ? 'visible' : 'hidden'}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.25,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Alternative Experiences (Not Just "No Animation")

The goal is not to eliminate all motion — it's to replace vestibular-triggering motion with alternatives that still communicate state change.

### Replace Slide with Crossfade

```css
/* DEFAULT: slides in from right */
.page-transition {
  animation: slide-in-from-right 300ms ease-out;
}

/* REDUCED: crossfade instead */
@media (prefers-reduced-motion: reduce) {
  .page-transition {
    animation: fade-in 200ms ease-out;
  }
}
```

### Replace Expand with Instant Reveal

```css
/* DEFAULT: height animates from 0 to auto */
.accordion-content {
  transition: height 250ms ease-out;
}

/* REDUCED: instant reveal, just fade */
@media (prefers-reduced-motion: reduce) {
  .accordion-content {
    transition: opacity 150ms ease-out;
  }
}
```

### Replace Scroll Animation with Static

```javascript
// DEFAULT: smooth scroll to element
element.scrollIntoView({ behavior: 'smooth' })

// REDUCED: instant jump
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

element.scrollIntoView({
  behavior: prefersReducedMotion ? 'auto' : 'smooth'
})
```

---

## What to Keep (Essential Motion)

Some motion is essential and should not be removed even for reduced-motion users:

| Animation | Why Keep It |
|-----------|------------|
| Loading spinner / progress indicator | Without it, users think the page is frozen |
| Focus ring transitions | Removing focus indicators harms keyboard users |
| Checkbox / toggle state change (opacity/color) | State feedback is essential, just use opacity not transform |
| Video playback | User-initiated, essential content |
| Scrolling behavior | Already handled by `scroll-behavior: auto` in global reset |
| Scroll position jumps from anchor links | `auto` scrolls are fine; smooth scrolls are what to disable |

### Loading Spinner Reduced-Motion Variant

Instead of removing the spinner entirely, make it non-rotating:

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Reduced: pulse instead of spin */
@media (prefers-reduced-motion: reduce) {
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  .spinner {
    animation: pulse 1.5s ease-in-out infinite;
  }
}
```

---

## Testing

### macOS (System Preferences)
System Settings → Accessibility → Display → Reduce Motion

### Windows (Settings)
Settings → Ease of Access → Display → Show animations in Windows → Off

### iOS (Settings)
Settings → Accessibility → Motion → Reduce Motion

### Android (Settings)
Settings → Accessibility → Remove animations (varies by OEM)

### Chrome DevTools (no OS setting needed)
1. Open DevTools (F12)
2. More tools → Rendering (or: Cmd+Shift+P → "Rendering")
3. Scroll to "Emulate CSS media feature prefers-reduced-motion"
4. Select "reduce"

---

## Graceful Degradation Code Example

Complete pattern combining CSS and JS for a dialog component:

```typescript
import { useReducedMotion } from 'framer-motion'

// CSS in dialog.css:
/*
  .dialog-overlay {
    animation: overlay-in 200ms ease-out both;
  }
  .dialog-content {
    animation: content-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .dialog-overlay,
    .dialog-content {
      animation: fade-in 100ms ease-out both;
    }
  }
*/

function AccessibleDialog({ open, onClose, children }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          forceMount
          className="dialog-overlay"
          // Faster animation for reduced motion (but still fade for state clarity)
          style={prefersReducedMotion ? { animationDuration: '100ms' } : undefined}
        />
        <Dialog.Content
          forceMount
          className="dialog-content"
          style={prefersReducedMotion ? { animationDuration: '100ms' } : undefined}
          // Ensure focus is managed regardless of animation state
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            // Focus first interactive element manually
            const firstFocusable = e.currentTarget.querySelector<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            firstFocusable?.focus()
          }}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```
