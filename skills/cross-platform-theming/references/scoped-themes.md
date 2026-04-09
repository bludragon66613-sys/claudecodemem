# Scoped Themes — DaisyUI data-theme

Reference for DaisyUI's `data-theme` attribute system, nested theming, 35 built-in themes, custom theme creation, and Tailwind v4 plugin configuration.

---

## The `data-theme` Attribute

DaisyUI themes are applied via the `data-theme` attribute on any HTML element. Setting it on `<html>` applies globally; setting it on a div scopes it to that subtree.

```html
<!-- Global theme on html element -->
<html data-theme="cupcake">

<!-- Scoped to a container -->
<div data-theme="dark">
  <p>This section is always dark</p>
  <button class="btn btn-primary">Dark button</button>
</div>

<!-- Rest of page uses parent theme -->
<p>This paragraph uses the global theme</p>
```

DaisyUI themes work purely through CSS custom properties — no JavaScript is required at runtime for basic theme application.

---

## Nested Themes

Any DOM subtree can have its own theme regardless of the parent. Useful for components that must always render in a specific theme (e.g., a dark preview panel inside a light admin UI).

```html
<html data-theme="light">
  <body>
    <header data-theme="dark">
      <!-- Header always dark, even if page is light -->
      <nav class="navbar bg-base-100">...</nav>
    </header>

    <main>
      <!-- Inherits light theme from html -->
      <section class="hero bg-base-200">...</section>

      <!-- Sidebar forced to a different theme -->
      <aside data-theme="forest">
        <ul class="menu bg-base-100">...</ul>
      </aside>
    </main>
  </body>
</html>
```

Nesting has no depth limit. Each `data-theme` sets the CSS custom properties at that element scope, and children inherit from the nearest ancestor with `data-theme`.

---

## 35 Built-in Themes

Full list of themes bundled with DaisyUI:

**Light themes:**
- `light` (default light)
- `cupcake` — soft pastels, pink/teal
- `bumblebee` — yellow/amber
- `emerald` — green
- `corporate` — professional blue/gray
- `retro` — warm vintage
- `valentine` — pink/rose
- `garden` — green earth tones
- `aqua` — bright cyan
- `lofi` — near-monochrome
- `pastel` — soft muted
- `fantasy` — warm vibrant
- `wireframe` — sketch/prototype aesthetic
- `cmyk` — print-like primary colors
- `autumn` — warm orange/brown
- `acid` — neon high-contrast
- `lemonade` — yellow/lime
- `winter` — cool blue-white
- `nord` — Arctic blue palette
- `caramellatte` — warm caramel browns
- `silk` — muted elegant neutrals

**Dark themes:**
- `dark` (default dark)
- `synthwave` — retro neon purple/pink
- `halloween` — orange/purple
- `forest` — deep green
- `black` — pure near-black
- `luxury` — gold on black
- `dracula` — purple/pink Dracula palette
- `night` — deep navy/indigo
- `coffee` — warm dark brown
- `dim` — muted dimmed dark
- `sunset` — warm orange dark
- `abyss` — deep dark blue
- `moonlight` — slate gray

**Special:**
- `cyberpunk` — aggressive yellow/magenta (suits neon UI)

---

## Compile-Time CSS Generation

DaisyUI generates all theme CSS variables at build time via the Tailwind plugin system. The plugin config in `tailwind.config.js` (v3) or CSS `@plugin` directive (v4) controls which themes are compiled.

### Tailwind v4 (CSS-based config)

```css
/* app.css or globals.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

The `--default` flag makes that theme active without any `data-theme` attribute. The `--prefersdark` flag activates when `prefers-color-scheme: dark` matches.

**Include specific themes only** (reduces CSS bundle size):

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake, nord, dracula;
}
```

### Tailwind v3 (JS config)

```js
// tailwind.config.js
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "nord"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
```

Setting `themes: false` disables all themes. Setting `themes: true` includes all 35.

---

## Custom Theme Creation

Define custom themes by specifying the 10 semantic color variables DaisyUI expects.

### Tailwind v4

```css
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark,
    mytheme {
      --color-primary: oklch(55% 0.25 260);
      --color-primary-content: oklch(98% 0 0);
      --color-secondary: oklch(65% 0.15 320);
      --color-secondary-content: oklch(98% 0 0);
      --color-accent: oklch(75% 0.2 150);
      --color-accent-content: oklch(10% 0 0);
      --color-neutral: oklch(30% 0.02 260);
      --color-neutral-content: oklch(98% 0 0);
      --color-base-100: oklch(98% 0 0);
      --color-base-200: oklch(93% 0 0);
      --color-base-300: oklch(86% 0 0);
      --color-base-content: oklch(20% 0.02 260);
      --color-info: oklch(70% 0.2 220);
      --color-success: oklch(65% 0.25 142);
      --color-warning: oklch(75% 0.2 85);
      --color-error: oklch(60% 0.25 30);
      --radius-selector: 2px;
      --radius-field: 4px;
      --radius-box: 8px;
      --size-selector: 1.75rem;
      --size-field: 2.25rem;
      --border: 1px;
    };
}
```

### Tailwind v3 (JS)

```js
daisyui: {
  themes: [
    {
      mytheme: {
        "primary": "#4f46e5",
        "primary-content": "#ffffff",
        "secondary": "#7c3aed",
        "accent": "#06b6d4",
        "neutral": "#1e1e2e",
        "base-100": "#ffffff",
        "base-200": "#f5f5f5",
        "base-300": "#e5e5e5",
        "base-content": "#1f2937",
        "info": "#3abff8",
        "success": "#36d399",
        "warning": "#fbbd23",
        "error": "#f87272",
        "--rounded-box": "1rem",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "1.9rem",
        "--animation-btn": "0.25s",
        "--animation-input": ".2s",
        "--btn-focus-scale": "0.95",
        "--border-btn": "1px",
        "--tab-border": "1px",
        "--tab-radius": ".5rem",
      },
    },
    "light",
    "dark",
  ],
}
```

---

## Scoping for Micro-Frontends

When embedding micro-frontends with DaisyUI, scope each MFE's theme to its mount point to avoid theme leakage.

```html
<!-- Host application -->
<html data-theme="corporate">
  <body>
    <main class="host-content">
      <!-- Host content uses corporate theme -->
    </main>

    <!-- Micro-frontend mount point with isolated theme -->
    <div id="mfe-checkout" data-theme="light">
      <!-- MFE renders here, always uses light theme -->
    </div>
  </body>
</html>
```

```js
// MFE bootstrap — set theme on mount root
const mountRoot = document.getElementById("mfe-checkout");
mountRoot.setAttribute("data-theme", mfeConfig.theme ?? "light");
```

### Shadow DOM Consideration

DaisyUI CSS custom properties propagate into shadow DOM via CSS variable inheritance. Shadow DOM does not block custom property inheritance. However, Tailwind utility classes require the stylesheet to be loaded in the same document (or duplicated inside the shadow root).

```js
// For shadow DOM components, inject a minimal theme stylesheet
const shadow = element.attachShadow({ mode: "open" });
const style = document.createElement("style");
style.textContent = `
  :host { 
    /* Inherit CSS vars from parent document */
    color: var(--color-base-content);
    background: var(--color-base-100);
  }
`;
shadow.appendChild(style);
```

---

## Theme Debugging

Inspect resolved custom properties in browser DevTools:

```js
// Log all DaisyUI tokens for current theme
const root = document.documentElement;
const style = getComputedStyle(root);
const daisyTokens = [
  "--color-primary",
  "--color-secondary",
  "--color-accent",
  "--color-base-100",
  "--color-base-content",
];
daisyTokens.forEach((t) => {
  console.log(t, "=", style.getPropertyValue(t));
});
```

---

## See Also

- `references/theme-switching.md` — Runtime switching, FOUC prevention, localStorage
- `references/framework-agnostic.md` — Using these tokens in React, Vue, Svelte, vanilla HTML
