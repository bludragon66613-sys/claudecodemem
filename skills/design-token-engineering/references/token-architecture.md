# Token Architecture Reference

Three-layer token system, naming conventions, scale generation, CSS variable output, W3C DTCG format, and validation patterns. Synthesized from Chakra UI, DaisyUI, and shadcn/ui.

---

## Three-Layer Architecture

```
Layer 1: Primitive Tokens
  Raw values — no semantic meaning
  --color-blue-500: #3b82f6
  --space-4: 16px
  --font-size-base: 16px

       ↓ references Layer 1

Layer 2: Semantic Tokens
  Meaningful names — reference primitives
  --color-action-primary: var(--color-blue-500)
  --space-content-gap: var(--space-4)
  --color-text-default: var(--color-gray-900)

       ↓ references Layer 2

Layer 3: Component Tokens
  Component-scoped — reference semantic tokens
  --button-bg: var(--color-action-primary)
  --button-padding-x: var(--space-content-gap)
  --card-body-text: var(--color-text-default)
```

This separation means:
- Rebrand: change primitive values → semantic + component tokens update automatically
- Dark mode: remap semantic tokens → all components update without touching component layer
- Component customization: override component tokens without breaking semantics

---

## Primitive Layer — Example

```css
:root {
  /* Color scale — all raw values */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  --color-blue-400: #60a5fa;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;

  --color-red-400: #f87171;
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;

  /* Spacing scale */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius primitives */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Font size scale */
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;
  --font-size-3xl:  1.875rem;
  --font-size-4xl:  2.25rem;
}
```

---

## Semantic Layer — Example

```css
:root {
  /* Text colors */
  --color-text-primary:   var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary:  var(--color-gray-400);
  --color-text-disabled:  var(--color-gray-300);
  --color-text-inverse:   var(--color-gray-50);
  --color-text-link:      var(--color-blue-600);
  --color-text-danger:    var(--color-red-600);

  /* Background colors */
  --color-bg-page:     var(--color-gray-50);
  --color-bg-surface:  white;
  --color-bg-overlay:  var(--color-gray-100);
  --color-bg-sunken:   var(--color-gray-200);

  /* Border colors */
  --color-border-default: var(--color-gray-200);
  --color-border-strong:  var(--color-gray-300);
  --color-border-focus:   var(--color-blue-500);
  --color-border-danger:  var(--color-red-500);

  /* Action colors */
  --color-action-primary:         var(--color-blue-600);
  --color-action-primary-hover:   var(--color-blue-700, #1d4ed8);
  --color-action-primary-text:    white;
  --color-action-danger:          var(--color-red-600);
  --color-action-danger-hover:    var(--color-red-700, #b91c1c);

  /* Semantic spacing */
  --space-inset-xs:  var(--space-1) var(--space-2);
  --space-inset-sm:  var(--space-2) var(--space-3);
  --space-inset-md:  var(--space-3) var(--space-4);
  --space-inset-lg:  var(--space-4) var(--space-6);
  --space-stack-sm:  var(--space-2);
  --space-stack-md:  var(--space-4);
  --space-stack-lg:  var(--space-6);
  --space-inline-sm: var(--space-2);
  --space-inline-md: var(--space-4);
}

/* Dark mode — remap semantic tokens, primitives unchanged */
.dark {
  --color-text-primary:   var(--color-gray-50);
  --color-text-secondary: var(--color-gray-400);
  --color-text-tertiary:  var(--color-gray-500);
  --color-text-disabled:  var(--color-gray-600);
  --color-text-inverse:   var(--color-gray-900);

  --color-bg-page:    var(--color-gray-950);
  --color-bg-surface: var(--color-gray-900);
  --color-bg-overlay: var(--color-gray-800);

  --color-border-default: var(--color-gray-700);
  --color-border-strong:  var(--color-gray-600);

  --color-action-primary: var(--color-blue-500);  /* lighter in dark mode */
}
```

---

## Component Token Layer — Example

```css
/* Button component tokens */
:root {
  --button-primary-bg:         var(--color-action-primary);
  --button-primary-bg-hover:   var(--color-action-primary-hover);
  --button-primary-text:       var(--color-action-primary-text);
  --button-primary-border:     transparent;

  --button-ghost-bg:           transparent;
  --button-ghost-bg-hover:     var(--color-bg-overlay);
  --button-ghost-text:         var(--color-text-primary);
  --button-ghost-border:       var(--color-border-default);

  --button-sm-padding:         var(--space-inset-xs);
  --button-md-padding:         var(--space-inset-sm);
  --button-lg-padding:         var(--space-inset-md);
  --button-radius:             var(--radius-md);

  --button-font-size:          var(--font-size-sm);
  --button-font-weight:        500;
}

/* Card component tokens */
:root {
  --card-bg:          var(--color-bg-surface);
  --card-border:      var(--color-border-default);
  --card-radius:      var(--radius-lg);
  --card-shadow:      0 1px 3px rgba(0,0,0,0.1);
  --card-padding:     var(--space-inset-lg);
  --card-gap:         var(--space-stack-md);
  --card-title-color: var(--color-text-primary);
  --card-body-color:  var(--color-text-secondary);
}
```

---

## Naming Conventions Compared

| System | Color Naming | Example |
|--------|-------------|---------|
| Chakra | `colors.{semantic}.{role}` | `colors.brand.primary`, `colors.red.500` |
| DaisyUI | semantic only | `primary`, `secondary`, `accent`, `base-100` |
| shadcn | CSS var semantic | `--primary`, `--muted`, `--card`, `--destructive` |
| Tailwind | utility scale | `blue-500`, `gray-900`, `red-600` |

### DaisyUI Semantic Names

```css
/* DaisyUI uses a fixed vocabulary — 20 semantic colors */
:root {
  --p:  /* primary */
  --pf: /* primary-focus */
  --pc: /* primary-content (text on primary) */

  --s:  /* secondary */
  --sf: /* secondary-focus */
  --sc: /* secondary-content */

  --a:  /* accent */
  --af: /* accent-focus */
  --ac: /* accent-content */

  --n:  /* neutral */
  --nf: /* neutral-focus */
  --nc: /* neutral-content */

  --b1: /* base-100 — page background */
  --b2: /* base-200 — slightly darker */
  --b3: /* base-300 — inputs, cards */
  --bc: /* base-content (text on base) */

  --in: /* info */
  --su: /* success */
  --wa: /* warning */
  --er: /* error */
}
```

---

## Scale Generation from Single Token

shadcn derives multiple radius values from one root token:

```css
:root {
  --radius: 0.625rem;  /* single source of truth */
}

/* Tailwind config derives scale */
theme.extend.borderRadius: {
  sm:   'calc(var(--radius) - 4px)',  /* 0.375rem */
  md:   'calc(var(--radius) - 2px)',  /* 0.5rem */
  lg:   'var(--radius)',               /* 0.625rem */
  xl:   'calc(var(--radius) + 4px)',  /* 0.875rem */
}
```

Same pattern for spacing, type scale:

```css
:root {
  --font-size-base: 1rem;
  /* Scale derived programmatically */
}

/* In JS: */
const fontScale = {
  xs:   `calc(var(--font-size-base) * 0.75)`,
  sm:   `calc(var(--font-size-base) * 0.875)`,
  base: `var(--font-size-base)`,
  lg:   `calc(var(--font-size-base) * 1.125)`,
  xl:   `calc(var(--font-size-base) * 1.25)`,
}
```

---

## W3C Design Tokens Community Group (DTCG) Format

Standard JSON format for interoperable tokens:

```json
{
  "color": {
    "$type": "color",
    "gray": {
      "50":  { "$value": "#f9fafb", "$description": "Lightest gray" },
      "500": { "$value": "#6b7280" },
      "900": { "$value": "#111827", "$description": "Darkest gray" }
    },
    "blue": {
      "500": { "$value": "#3b82f6" },
      "600": { "$value": "#2563eb" }
    }
  },
  "spacing": {
    "$type": "dimension",
    "4": { "$value": "16px" },
    "8": { "$value": "32px" }
  },
  "typography": {
    "body": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Inter, sans-serif",
        "fontSize": "16px",
        "fontWeight": "400",
        "lineHeight": "1.5"
      }
    }
  },
  "border": {
    "default": {
      "$type": "border",
      "$value": {
        "color": "{color.gray.200}",  /* reference using {} syntax */
        "width": "1px",
        "style": "solid"
      }
    }
  }
}
```

**W3C reference syntax:** `{path.to.token}` — tooling resolves to the actual value.

Tools that consume DTCG format: Style Dictionary, Token Pipeline, Tokens Studio for Figma, Specify.

---

## CSS Variable Generation Pattern

```ts
// Style Dictionary config (style-dictionary.config.js)
import StyleDictionary from 'style-dictionary'

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: '',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          selector: ':root',
          outputReferences: true,  // use var() references, not resolved values
        }
      }]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [{
        destination: 'tokens.ts',
        format: 'javascript/es6'
      }]
    }
  }
})

sd.buildAllPlatforms()
```

Input `tokens/color.json`:
```json
{ "color": { "primary": { "$value": "#3b82f6", "$type": "color" } } }
```

Output `tokens.css`:
```css
:root {
  --color-primary: #3b82f6;
}
```

---

## Token Validation Checklist

**Coverage validation:**
- Every component uses only semantic tokens, never raw primitives directly
- Every semantic token maps to exactly one primitive
- No orphaned tokens (defined but never referenced)
- No missing dark mode mappings for semantic tokens

**Naming validation:**
```ts
// Naming rules to enforce:
const TOKEN_NAMING_RULES = {
  primitives: /^--[a-z]+-[a-z]+-\d+$/,           // --color-blue-500
  semantic:   /^--[a-z]+-[a-z]+-[a-z]+$/,         // --color-text-primary
  component:  /^--[a-z]+-[a-z]+-[a-z]+-[a-z]+$/, // --button-primary-bg
}
```

**Contrast validation (WCAG):**
```ts
// Check all text/background token pairs meet WCAG AA (4.5:1)
// Tools: color.js, polished, wcag-contrast
import { getContrast } from 'polished'
const ratio = getContrast('#111827', '#f9fafb') // → 16.1 (passes AAA)
```

**Migration validation:**
```bash
# Find any direct color values not using tokens
grep -rn 'color: #\|background: #\|border-color: #' src/
# Find any Tailwind color utilities that bypass tokens
grep -rn 'text-blue-\|bg-red-\|border-gray-' src/
```
