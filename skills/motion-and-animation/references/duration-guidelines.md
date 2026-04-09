# Animation Duration and Timing Guidelines

The most common animation mistake is using the wrong duration. Too fast: users don't register the transition. Too slow: users feel like they're waiting. This file provides concrete timing values, easing functions, and ready-to-use CSS recipes.

---

## Per-Platform Timing Tables

### Web

| Interaction Type | Duration | Notes |
|-----------------|---------|-------|
| Hover state change | 100-150ms | Instant enough to feel responsive |
| Focus ring appearance | 100ms | Must not lag behind keyboard navigation |
| Toggle (checkbox, switch) | 150ms | Micro-interaction |
| Tooltip appear | 150ms delay + 150ms fade | Delay prevents accidental triggers |
| Tooltip disappear | 75ms fade | Exits should be faster than enters |
| Dropdown open | 150-200ms | Menu feels snappy |
| Dropdown close | 100-150ms | Exits faster than enters |
| Modal / Dialog open | 200-250ms | Enough weight to feel significant |
| Modal / Dialog close | 150-200ms | Exit slightly faster |
| Page transition | 250-350ms | Full-page change needs more time |
| Sidebar open/close | 250-300ms | Spatial transition |
| Toast appear | 250ms | Needs to be noticed |
| Toast dismiss | 200ms | Auto-dismiss is neutral |
| Loading skeleton fade-in | 200ms | Subtle entry |
| Skeleton → content swap | 300ms | Feels like content arriving |

**Hard limit: 400ms.** Any animation longer than 400ms on the web starts to feel like waiting rather than transitioning. Reserve 300-400ms only for full-page transitions.

### macOS (HIG)

| Context | Duration | Reference |
|---------|---------|-----------|
| Fast (hover, toggle) | 150ms | macOS system animations |
| Normal (expand, open panel) | 250ms | Consistent with system feel |
| Slow (major transitions) | 350ms | Rare; used for sheet presentations |

### iOS (HIG)

| Context | Duration | Reference |
|---------|---------|-----------|
| Entrance animation | 180ms | iOS system UI |
| Exit animation | 120ms | Exits are always faster |
| Spring-based transitions | ~300-400ms (settles naturally) | SpringAnimation, no explicit duration |
| Pressed state feedback | 50-80ms | Must be instant |

**iOS principle:** Exit faster than enter. 120ms exit vs 180ms enter is the ratio Apple uses throughout UIKit.

### Why exits should be faster than enters

Enter: user triggered an action, they're watching for the result. Slightly longer enter gives the result appropriate weight.

Exit: user is moving on. The element should get out of the way quickly. Lingering exits feel like the UI is holding users back.

**Rule:** Exit duration = 60-75% of enter duration.

---

## Easing Functions

### The Core Three

```css
/* Entering elements — decelerates into final position */
.enter { transition-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1); }
/* Named: ease-out */

/* Exiting elements — accelerates toward removal */
.exit  { transition-timing-function: cubic-bezier(0.4, 0.0, 1, 1); }
/* Named: ease-in */

/* Moving elements that stay on screen */
.move  { transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1); }
/* Named: ease-in-out */
```

### Premium Easing (Spring-Feel Without Physics Library)

```css
/* Used by Apple, Linear, Vercel — feels physically correct */
.spring-enter { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
/* This over-shoots slightly then settles — gives weight and life */
```

This is the "springy" feel you see in high-quality apps. The curve reaches y>1 momentarily (slight overshoot), then settles back. Duration should be 300ms with this curve.

### Easing Quick Reference

| Name | Curve | Use |
|------|-------|-----|
| ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entering elements |
| ease-in | `cubic-bezier(0.4, 0.0, 1, 1)` | Exiting elements |
| ease-in-out | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Elements moving position |
| spring | `cubic-bezier(0.16, 1, 0.3, 1)` | Premium enters, modals |
| linear | `linear` | Spinners, progress bars only |

**Never use `ease` (CSS default) or `ease-in-out` (CSS built-in) directly.** They're close but not quite right. Use explicit cubic-bezier values.

---

## CSS-Only Animation Recipes

These are complete, copy-paste keyframe sets for common patterns. Each includes enter + exit pair.

### Fade

```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* Usage */
.fade-in  { animation: fade-in  200ms cubic-bezier(0.0, 0.0, 0.2, 1) both; }
.fade-out { animation: fade-out 150ms cubic-bezier(0.4, 0.0, 1, 1)   both; }
```

### Slide (vertical)

```css
@keyframes slide-up {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}
@keyframes slide-down-out {
  from { transform: translateY(0);   opacity: 1; }
  to   { transform: translateY(8px); opacity: 0; }
}

/* Usage: dropdown menus opening downward */
.slide-up      { animation: slide-up       250ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.slide-down-out{ animation: slide-down-out 150ms cubic-bezier(0.4, 0.0, 1, 1)   both; }
```

### Scale

```css
@keyframes scale-in {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
@keyframes scale-out {
  from { transform: scale(1);    opacity: 1; }
  to   { transform: scale(0.92); opacity: 0; }
}

/* Usage: popovers, tooltips, context menus */
.scale-in  { animation: scale-in  200ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.scale-out { animation: scale-out 150ms cubic-bezier(0.4, 0.0, 1, 1)   both; }
```

### Slide + Fade Combined (most commonly correct for menus/tooltips)

```css
@keyframes slide-fade-in {
  from { transform: translateY(6px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}
@keyframes slide-fade-out {
  from { transform: translateY(0);   opacity: 1; }
  to   { transform: translateY(6px); opacity: 0; }
}

.slide-fade-in  { animation: slide-fade-in  200ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.slide-fade-out { animation: slide-fade-out 150ms cubic-bezier(0.4, 0.0, 1, 1)   both; }
```

**Why `both` fill mode?** `animation-fill-mode: both` means:
- Before animation plays: element holds `from` state (prevents flash at zero opacity)
- After animation ends: element holds `to` state (no snap back)

Always use `both` on CSS keyframe animations.

---

## Performance Guidelines

### Animate ONLY These Properties

```css
/* SAFE — compositor-only, no layout or paint */
transform: translateX / translateY / translateZ / scale / rotate
opacity

/* UNSAFE — triggers layout recalculation */
width, height, top, left, right, bottom
padding, margin
border-width
font-size
```

Animating `width` from 0 to 200px triggers a layout recalculation on every frame. Animating `transform: scaleX()` from 0 to 1 does not. **Always use transform instead of positional properties.**

### `will-change` Usage

```css
/* Correct: applied before animation starts */
.modal-content {
  will-change: transform, opacity;
}

/* Correct: added via JS just before animation, removed after */
element.style.willChange = 'transform';
// ... animation completes ...
element.style.willChange = 'auto';  // clean up
```

**Rules:**
- Only use `will-change` on elements you know will animate
- Remove it after animation completes — leaving it on everything is worse than nothing (consumes GPU memory)
- Never use `will-change: all`
- Don't pre-optimize with `will-change` — only add it when profiling shows jank

### Containment

```css
/* Prevent animated elements from triggering parent layout recalc */
.animation-container {
  contain: layout style;
  /* or: */
  isolation: isolate;
}
```

---

## When NOT to Animate

Some interactions should be instant. Animation on these hurts, not helps:

| Interaction | Why No Animation |
|-------------|-----------------|
| Button press feedback | Needs to feel physical and immediate (use CSS `:active` only) |
| Form validation error appearance | Urgency requires instant visibility |
| Focus indicator | Delay between keyboard nav and visible focus is disorienting |
| Error page load | User is already frustrated |
| Redirects | User initiated navigation; animation feels like delay |
| Table row selection | Multiple rapid clicks; animation queues are confusing |
| Search input results | Each keystroke shouldn't animate a new results list |

The test: would the user experience this animation as "useful information" or "waiting"? If waiting, remove it.

---

## Tailwind CSS Animation Utilities

```css
/* Add to tailwind.config.js or CSS if using Tailwind v4 */
@theme {
  --animate-fade-in: fade-in 200ms cubic-bezier(0, 0, 0.2, 1) both;
  --animate-fade-out: fade-out 150ms cubic-bezier(0.4, 0, 1, 1) both;
  --animate-slide-fade-in: slide-fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
  --animate-slide-fade-out: slide-fade-out 150ms cubic-bezier(0.4, 0, 1, 1) both;
}
```

Then in markup:
```html
<div class="animate-slide-fade-in">...</div>
```

With Tailwind v4's `@keyframes` in CSS, define the keyframes globally and reference via `animation` theme tokens.
