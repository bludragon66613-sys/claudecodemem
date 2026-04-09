# Framework-Agnostic Theming

Reference for building theme systems that work identically across React, Vue, Svelte, and vanilla HTML using CSS custom properties as the universal layer.

---

## Why Framework-Agnostic

A theme system tied to React's context API or Vue's provide/inject breaks when you:
- Embed a Vue micro-frontend in a React app
- Need the same component in Storybook, production, and email templates
- Use server-side rendering across different frameworks
- Build a design system consumed by multiple tech stacks

CSS custom properties are the universal runtime that all frameworks read. Set variables at the DOM level; let each framework consume them via its own utilities.

---

## The CSS Variable Approach

Define all theme tokens as CSS custom properties. Frameworks consume them; none of them own them.

```css
/* tokens.css — no framework dependencies */
:root,
[data-theme="light"] {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-accent: #4f46e5;
  --color-accent-hover: #4338ca;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
}

[data-theme="dark"] {
  --color-bg-primary: #09090b;
  --color-bg-secondary: #18181b;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-border: #27272a;
  --color-accent: #818cf8;
  --color-accent-hover: #a5b4fc;
}
```

Theme switching is a single DOM attribute change — no re-renders, no context propagation, no framework involvement:

```js
document.documentElement.setAttribute("data-theme", "dark");
```

---

## The Same Component Across 4 Frameworks

A card component using only CSS variables — identical visual output in all frameworks.

**HTML (vanilla)**

```html
<div class="card">
  <h2 class="card-title">Card Title</h2>
  <p class="card-body">Content goes here.</p>
</div>

<style>
  .card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  .card-title {
    color: var(--color-text-primary);
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .card-body {
    color: var(--color-text-secondary);
    margin: 0;
  }
</style>
```

**React / Next.js**

```tsx
// Card.tsx — no theme context needed
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
```

```css
/* Card.module.css */
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}
.title {
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.body {
  color: var(--color-text-secondary);
}
```

**Vue 3**

```vue
<!-- Card.vue — no inject() or useTheme() -->
<template>
  <div class="card">
    <h2 class="card-title">{{ title }}</h2>
    <div class="card-body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style scoped>
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}
.card-title {
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.card-body {
  color: var(--color-text-secondary);
}
</style>
```

**Svelte**

```svelte
<!-- Card.svelte — no getContext() -->
<script lang="ts">
  export let title: string;
</script>

<div class="card">
  <h2 class="card-title">{title}</h2>
  <div class="card-body"><slot /></div>
</div>

<style>
  .card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  .card-title {
    color: var(--color-text-primary);
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .card-body {
    color: var(--color-text-secondary);
  }
</style>
```

All four use the same CSS variable names. The `tokens.css` file is loaded once globally.

---

## Tailwind Semantic Mapping

Map CSS variables to Tailwind utilities so you get utility class ergonomics while retaining the framework-agnostic token layer.

### Tailwind v4

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: var(--color-bg-primary);
  --color-bg-secondary: var(--color-bg-secondary);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-border: var(--color-border);
  --color-accent: var(--color-accent);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
}
```

Now use `bg-bg-secondary`, `text-text-primary`, `border-border`, `rounded-md` etc. as utilities.

### Tailwind v3

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
};
```

---

## DaisyUI Zero-JS Approach

DaisyUI is the most framework-agnostic library available. It generates all theme CSS at build time. No JavaScript ships for theming. The same class names work everywhere.

```html
<!-- Works identically in React, Vue, Svelte, HTMX, plain HTML -->
<div class="card bg-base-200 shadow-md">
  <div class="card-body">
    <h2 class="card-title text-base-content">Title</h2>
    <p class="text-base-content/70">Body text</p>
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

DaisyUI tokens: `bg-base-100/200/300`, `text-base-content`, `bg-primary`, `text-primary-content`, `bg-secondary`, `bg-accent`, `bg-neutral`.

Theme switching requires zero framework code — set `data-theme` on a DOM element and DaisyUI's CSS handles the rest.

---

## Chakra Semantic Token Mapping

Chakra UI v3 uses semantic tokens that resolve to different values per color mode. The token values are CSS custom properties at runtime, making them readable by non-Chakra code.

```ts
// theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        "bg.primary": {
          value: { _light: "#ffffff", _dark: "#09090b" },
        },
        "bg.secondary": {
          value: { _light: "#f5f5f5", _dark: "#18181b" },
        },
        "text.primary": {
          value: { _light: "#111827", _dark: "#fafafa" },
        },
        "text.muted": {
          value: { _light: "#6b7280", _dark: "#a1a1aa" },
        },
        accent: {
          value: { _light: "#4f46e5", _dark: "#818cf8" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
```

Chakra emits these as `--chakra-colors-bg-primary` etc. at runtime. Non-Chakra components in the same page can use `var(--chakra-colors-bg-primary)` directly.

---

## Flowbite ThemeProvider

Flowbite React exposes a `createTheme()` helper and `<ThemeProvider>` context for component customization. Unlike pure CSS tokens, this overrides component-level class maps — useful when you need to change which Tailwind classes a Flowbite component applies.

```tsx
import { ThemeProvider, createTheme } from "flowbite-react";

const customTheme = createTheme({
  button: {
    color: {
      primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    },
    size: {
      lg: "px-6 py-3 text-base",
    },
  },
  card: {
    root: {
      base: "rounded-xl border border-border bg-bg-secondary shadow-sm",
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* Flowbite components use customTheme */}
    </ThemeProvider>
  );
}
```

The `createTheme()` return value is a plain object — portable across React/Next.js without modification.

---

## Token Consumption Comparison

| Layer | DaisyUI | Chakra | Tailwind + CSS vars | Flowbite |
|-------|---------|--------|---------------------|----------|
| Definition | CSS `@plugin` config | TypeScript `defineConfig` | `@theme` or `tailwind.config.js` | `createTheme()` |
| Runtime format | CSS custom properties | CSS custom properties | CSS custom properties | Tailwind class strings |
| Framework needed | None | React | None | React/Vue/Svelte wrappers |
| JS bundle cost | Zero | ~50KB runtime | Zero | ~30KB |
| Multi-framework | Yes | No | Yes | Partial |

---

## See Also

- `references/scoped-themes.md` — DaisyUI data-theme, nested themes, 35 built-in themes
- `references/theme-switching.md` — FOUC prevention, localStorage persistence, SSR
