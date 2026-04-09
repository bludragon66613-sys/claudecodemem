# Glass-Morphism — Backdrop Filter Architecture

Reference for implementing glass-morphism in web apps: backdrop-filter composition, layer management, semantic color variables, border effects, Tailwind v4, and performance.

---

## The Glass Effect Formula

Glass-morphism requires three ingredients working together:
1. **Blur** — `backdrop-filter: blur()` softens the content behind
2. **Saturation boost** — `saturate()` makes blurred content more vivid
3. **Semi-transparent background** — rgba/oklch with alpha lets blur show through

Without all three, you get either a frosted blur (no color) or a translucent flat color (no blur).

---

## Core CSS

```css
.glass {
  /* The blur + saturation — the signature glass look */
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);

  /* Semi-transparent background — lets blur show */
  background-color: rgba(255, 255, 255, 0.72);

  /* Subtle top/left edge highlight */
  border: 1px solid rgba(255, 255, 255, 0.30);

  /* Ensure the GPU compositing layer is promoted */
  transform: translateZ(0);
  will-change: backdrop-filter;
}

/* Dark mode variant */
[data-theme="dark"] .glass {
  background-color: rgba(28, 28, 30, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.10);
}
```

---

## Blur + Saturate Combinations by Surface Type

Different surfaces warrant different intensities:

```css
:root {
  /* Sidebar — strong blur, moderate opacity */
  --glass-sidebar-bg-light: rgba(248, 248, 248, 0.80);
  --glass-sidebar-blur: blur(20px) saturate(180%);

  /* Toolbar — slightly less opaque than sidebar */
  --glass-toolbar-bg-light: rgba(246, 246, 246, 0.72);
  --glass-toolbar-blur: blur(16px) saturate(160%);

  /* Card / panel on content area */
  --glass-card-bg-light: rgba(255, 255, 255, 0.60);
  --glass-card-blur: blur(12px) saturate(150%);

  /* Popover / dropdown */
  --glass-popover-bg-light: rgba(255, 255, 255, 0.88);
  --glass-popover-blur: blur(24px) saturate(200%);

  /* Modal overlay background */
  --glass-modal-scrim: rgba(0, 0, 0, 0.35);

  /* Dark mode */
  --glass-sidebar-bg-dark: rgba(30, 30, 30, 0.80);
  --glass-toolbar-bg-dark: rgba(36, 36, 36, 0.72);
  --glass-card-bg-dark: rgba(44, 44, 46, 0.60);
  --glass-popover-bg-dark: rgba(44, 44, 46, 0.92);
}
```

---

## Layer Z-Index Hierarchy

Glass surfaces stack. Assign z-index tiers intentionally to avoid visual chaos:

```css
:root {
  /* Z-index tiers — glass surfaces */
  --z-base: 0;         /* Page content */
  --z-card: 10;        /* Floating cards */
  --z-sidebar: 20;     /* Sidebar */
  --z-toolbar: 30;     /* Top toolbar */
  --z-dropdown: 100;   /* Dropdowns, context menus */
  --z-popover: 200;    /* Popovers, tooltips */
  --z-modal-bg: 300;   /* Modal backdrop */
  --z-modal: 400;      /* Modal itself */
  --z-toast: 500;      /* Toast notifications */
  --z-cursor: 9999;    /* Custom cursors, drag ghosts */
}

.sidebar  { z-index: var(--z-sidebar); }
.toolbar  { z-index: var(--z-toolbar); }
.dropdown { z-index: var(--z-dropdown); }
.popover  { z-index: var(--z-popover); }
.modal-bg { z-index: var(--z-modal-bg); }
.modal    { z-index: var(--z-modal); }
```

**Rule:** Never let two glass surfaces with the same z-tier overlap. The blur of one surface compositing against the blur of another creates visual mud.

---

## Semantic Color Variables for Glass

Avoid hardcoding rgba values everywhere. Define glass surface colors as semantic tokens:

```css
:root {
  /* Glass surface backgrounds */
  --surface-glass-primary: rgba(255, 255, 255, 0.72);
  --surface-glass-secondary: rgba(248, 248, 248, 0.65);
  --surface-glass-overlay: rgba(255, 255, 255, 0.88);

  /* Glass borders */
  --border-glass: rgba(255, 255, 255, 0.30);
  --border-glass-strong: rgba(255, 255, 255, 0.50);
  --border-glass-subtle: rgba(255, 255, 255, 0.15);

  /* Glass shadows */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.08),
                  0 1px 2px rgba(0, 0, 0, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.50);

  /* Blur values */
  --blur-glass-sm: blur(8px) saturate(150%);
  --blur-glass-md: blur(16px) saturate(180%);
  --blur-glass-lg: blur(24px) saturate(200%);
}

[data-theme="dark"] {
  --surface-glass-primary: rgba(28, 28, 30, 0.72);
  --surface-glass-secondary: rgba(36, 36, 36, 0.65);
  --surface-glass-overlay: rgba(44, 44, 46, 0.92);

  --border-glass: rgba(255, 255, 255, 0.10);
  --border-glass-strong: rgba(255, 255, 255, 0.18);
  --border-glass-subtle: rgba(255, 255, 255, 0.06);

  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.24),
                  0 1px 2px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

---

## Border Effects on Glass Edges

Borders add definition and simulate the physical edge of glass catching light:

```css
/* Top-left highlight — light catches the edge */
.glass-card {
  backdrop-filter: var(--blur-glass-md);
  background: var(--surface-glass-primary);
  border-radius: 12px;
  overflow: hidden; /* Clip blur to radius */

  /* Option 1: Single uniform border */
  border: 1px solid var(--border-glass);

  /* Option 2: Top edge highlight + bottom shadow edge */
  border-top: 1px solid rgba(255, 255, 255, 0.40);
  border-left: 1px solid rgba(255, 255, 255, 0.30);
  border-right: 1px solid rgba(255, 255, 255, 0.10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  /* Option 3: Inset highlight via box-shadow */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.50), /* top inner highlight */
    inset 0 -1px 0 rgba(0, 0, 0, 0.05),       /* bottom inner shadow */
    0 4px 16px rgba(0, 0, 0, 0.08);           /* outer shadow */
}
```

Option 3 (inset box-shadow) is preferred — it's achievable with a single `border-radius` + `overflow: hidden` without direction-specific borders.

---

## Tailwind v4 Implementation

```html
<!-- Utility composition — Tailwind v4 -->
<div class="
  backdrop-blur-md
  saturate-150
  bg-white/70
  border border-white/30
  rounded-xl
  shadow-lg
">
  Glass card content
</div>

<!-- Dark mode variant -->
<div class="
  backdrop-blur-md
  saturate-150
  bg-white/70 dark:bg-zinc-900/70
  border border-white/30 dark:border-white/10
  rounded-xl
  shadow-lg
">
  Adaptive glass card
</div>
```

Custom glass utility for reuse:

```css
/* In globals.css */
@layer components {
  .glass-surface {
    @apply backdrop-blur-md saturate-150 bg-white/70 dark:bg-zinc-900/70;
    @apply border border-white/25 dark:border-white/10;
    @apply shadow-[0_8px_32px_rgba(0,0,0,0.08)];
  }

  .glass-surface-strong {
    @apply backdrop-blur-xl saturate-200 bg-white/85 dark:bg-zinc-900/85;
    @apply border border-white/40 dark:border-white/15;
  }
}
```

---

## Performance Considerations

`backdrop-filter` is GPU-expensive. Each blurred element creates a stacking context and requires a compositor layer.

**Rules:**

1. **Limit count:** Max 3–4 backdrop-filter elements visible simultaneously. More causes frame drops on integrated GPUs.

2. **Avoid animating backdrop-filter directly:** Animating `blur()` value is extremely expensive. Animate `opacity` or `transform` instead; toggle the glass effect class on/off.

3. **Promote the layer explicitly:**
   ```css
   .glass {
     will-change: transform; /* or backdrop-filter */
     transform: translateZ(0); /* force GPU layer promotion */
   }
   ```

4. **Don't apply to every card:** Only top-level chrome surfaces (toolbar, sidebar, floating panels). Content cards should use opaque backgrounds.

5. **Test on low-end hardware:** Safari on older Macs and Chrome on integrated graphics will show performance degradation at >4 simultaneous blur surfaces.

---

## Fallback for Browsers Without Support

`backdrop-filter` is widely supported (97%+ global) but should degrade gracefully:

```css
.glass {
  /* Fallback: semi-opaque without blur */
  background-color: rgba(255, 255, 255, 0.92);
}

@supports (backdrop-filter: blur(1px)) {
  .glass {
    background-color: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }
}
```

---

## See Also

- `references/window-chrome.md` — Traffic lights, title bar, sidebar — key surfaces that use glass
- `references/electron-tauri.md` — Native vibrancy API that achieves OS-level glass on desktop apps
