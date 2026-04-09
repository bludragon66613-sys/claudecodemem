# OKLCH Color System Reference

OKLCH format, perceptual uniformity, shadcn base palettes, dark mode mapping, semantic tokens, and WCAG contrast. Synthesized from shadcn/ui v2, CSS Color Level 4 spec.

---

## OKLCH Format

```css
oklch(lightness chroma hue)
oklch(lightness chroma hue / alpha)
```

**Parameter ranges:**
| Parameter | Range | Description |
|-----------|-------|-------------|
| Lightness | `0` to `1` (or `0%` to `100%`) | 0 = black, 1 = white |
| Chroma | `0` to ~`0.4` (practical max ~`0.37`) | 0 = gray, higher = more saturated |
| Hue | `0` to `360` degrees | Same as HSL hue |
| Alpha | `0` to `1` (or `0%` to `100%`) | Optional, same as other formats |

```css
/* Example values */
oklch(0.5 0.2 220)      /* mid-lightness, moderate chroma, blue hue */
oklch(0.9 0 0)           /* near-white, no chroma (gray) */
oklch(0.145 0 0)         /* near-black, no chroma */
oklch(0.577 0.245 27)    /* vivid red-orange (destructive) */
oklch(0.7 0.15 150)      /* medium green */
oklch(0.8 0.1 250 / 0.5) /* translucent blue */
```

---

## Why OKLCH Over HSL

### The Perceptual Uniformity Problem

HSL has a fatal flaw: equal numeric lightness steps do NOT look equally spaced to human eyes.

```css
/* HSL — these look very different in perceived brightness */
hsl(0 100% 50%)    /* vivid red — perceived as quite dark */
hsl(60 100% 50%)   /* vivid yellow — perceived as much brighter */
hsl(240 100% 50%)  /* vivid blue — perceived as very dark */
/* All have L=50% but look completely different */
```

```css
/* OKLCH — equal lightness values are perceptually equal */
oklch(0.5 0.2 0)    /* red at 50% lightness */
oklch(0.5 0.2 60)   /* yellow at 50% lightness */
oklch(0.5 0.2 240)  /* blue at 50% lightness */
/* All genuinely appear the same brightness to human eyes */
```

### Practical Benefits

1. **Dark mode is systematic:** Subtract a fixed amount from lightness and the result looks right. No HSL fudging per-hue.
2. **Scale generation is reliable:** A 10-step lightness scale actually looks like 10 equal steps.
3. **Chroma stays stable across lightness:** In HSL, you get "washed out" colors at high/low lightness. OKLCH chroma remains perceptually consistent.
4. **Wide gamut ready:** OKLCH can express P3 display gamut colors that sRGB/HSL cannot.

---

## shadcn Base Color Palettes

shadcn v2 ships these named palettes, each with 12 lightness steps:

### Zinc (Default)
```css
/* zinc — neutral with very slight cool/blue undertone */
--zinc-50:  oklch(0.985 0.002 247.839);
--zinc-100: oklch(0.967 0.003 264.542);
--zinc-200: oklch(0.92  0.004 286.32);
--zinc-300: oklch(0.871 0.006 286.286);
--zinc-400: oklch(0.705 0.015 286.067);
--zinc-500: oklch(0.552 0.016 285.938);
--zinc-600: oklch(0.442 0.017 285.786);
--zinc-700: oklch(0.37  0.013 285.805);
--zinc-800: oklch(0.274 0.006 286.618);
--zinc-900: oklch(0.21  0.006 285.885);
--zinc-950: oklch(0.141 0.005 285.823);
```

### Slate
```css
/* slate — cooler, more blue-gray */
--slate-50:  oklch(0.984 0.003 247.858);
--slate-100: oklch(0.968 0.007 247.896);
--slate-500: oklch(0.554 0.046 257.417);
--slate-900: oklch(0.208 0.042 265.755);
--slate-950: oklch(0.129 0.042 264.695);
```

### Stone
```css
/* stone — warm, slight brown undertone */
--stone-50:  oklch(0.985 0.001 106.423);
--stone-500: oklch(0.553 0.013 58.071);
--stone-900: oklch(0.216 0.006 56.043);
```

### Neutral
```css
/* neutral — pure gray, no color cast */
--neutral-50:  oklch(0.985 0 0);
--neutral-500: oklch(0.556 0 0);
--neutral-900: oklch(0.205 0 0);
```

---

## Semantic Token Mapping in shadcn

Full `:root` and `.dark` variable block:

```css
@layer base {
  :root {
    /* Base surfaces */
    --background:     oklch(1 0 0);          /* pure white */
    --foreground:     oklch(0.145 0 0);      /* near-black text */

    /* Card / popover */
    --card:           oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover:        oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);

    /* Primary action */
    --primary:        oklch(0.205 0 0);      /* dark — button bg */
    --primary-foreground: oklch(0.985 0 0);  /* white text on primary */

    /* Secondary / muted */
    --secondary:      oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted:          oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);    /* gray text */

    /* Accent */
    --accent:         oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);

    /* Destructive */
    --destructive:    oklch(0.577 0.245 27.325);  /* vivid red */

    /* Borders and inputs */
    --border:         oklch(0.922 0 0);
    --input:          oklch(0.922 0 0);
    --ring:           oklch(0.708 0 0);      /* focus ring */

    /* Scale token */
    --radius: 0.625rem;

    /* Sidebar (if using shadcn sidebar component) */
    --sidebar:        oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring:   oklch(0.708 0 0);
  }

  .dark {
    --background:     oklch(0.145 0 0);      /* near-black */
    --foreground:     oklch(0.985 0 0);      /* near-white text */

    --card:           oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover:        oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);

    --primary:        oklch(0.985 0 0);      /* inverted: white button */
    --primary-foreground: oklch(0.205 0 0);  /* dark text on white */

    --secondary:      oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted:          oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);

    --accent:         oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);

    --destructive:    oklch(0.704 0.191 22.216);  /* lighter red for dark bg */

    --border:         oklch(1 0 0 / 10%);    /* white with 10% opacity */
    --input:          oklch(1 0 0 / 15%);
    --ring:           oklch(0.556 0 0);

    --sidebar:        oklch(0.205 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
  }
}
```

---

## Dark Mode Derivation Strategy

**Rule of thumb for OKLCH dark mode:**
- Light background (`0.9-1.0`) → Dark background (`0.1-0.2`): subtract ~0.8 from L
- Light text (`0.1-0.2`) → Dark text (`0.9-1.0`): add ~0.8 to L
- Colored tokens (chroma > 0): increase L slightly AND may reduce chroma for dark

```css
/* Systematic derivation pattern */
/* Light:  L = x      → Dark: L ≈ 1 - x */
/* L=0.97 muted       → L=0.269 dark muted (not exact 0.03 — boosted for visibility) */
/* L=0.145 foreground → L=0.985 dark foreground */
/* L=0.205 primary    → L=0.985 dark primary (inverted — dark uses white) */

/* For chromatic (colored) tokens: */
/* Light destructive: oklch(0.577 0.245 27) — mid lightness, high chroma */
/* Dark  destructive: oklch(0.704 0.191 22) — higher L (readable on dark bg), lower chroma */
```

---

## Contrast Checking with OKLCH

WCAG contrast is calculated from relative luminance, not OKLCH lightness directly. However, OKLCH L correlates closely with luminance for neutral colors.

**WCAG requirements:**
- AA Normal text: 4.5:1
- AA Large text (18pt+ or 14pt+ bold): 3:1
- AAA Normal text: 7:1

```ts
// Using the 'color' npm package for WCAG checks
import Color from 'colorjs.io'

function wcagContrast(foreground: string, background: string): number {
  const fg = new Color(foreground)
  const bg = new Color(background)
  return fg.contrast(bg, 'WCAG21')
}

// shadcn semantic pairs — should all pass AA
wcagContrast('oklch(0.145 0 0)', 'oklch(1 0 0)')         // foreground on background → ~17:1 ✓
wcagContrast('oklch(0.556 0 0)', 'oklch(1 0 0)')         // muted-foreground on background → ~4.6:1 ✓
wcagContrast('oklch(0.985 0 0)', 'oklch(0.205 0 0)')     // primary-foreground on primary → ~15:1 ✓
wcagContrast('oklch(0.985 0 0)', 'oklch(0.577 0.245 27)') // white on destructive → check this
```

```ts
// Batch validation — check all semantic token pairs
const tokenPairs = [
  { fg: '--foreground',        bg: '--background' },
  { fg: '--muted-foreground',  bg: '--background' },
  { fg: '--muted-foreground',  bg: '--muted' },
  { fg: '--primary-foreground', bg: '--primary' },
  { fg: '--secondary-foreground', bg: '--secondary' },
  { fg: '--card-foreground',   bg: '--card' },
]
```

---

## DaisyUI + OKLCH Integration

DaisyUI v4 accepts OKLCH values directly for its semantic color system:

```css
:root {
  /* DaisyUI v4 — OKLCH color values */
  --p:  0.491 0.270 292.581;   /* primary: oklch(0.491 0.270 292.581) = vivid purple */
  --s:  0.425 0.184 265.638;   /* secondary: dark blue */
  --a:  0.890 0.199 119.473;   /* accent: bright lime */
  --n:  0.323 0.022 263.532;   /* neutral: dark blue-gray */
  --b1: 1.000 0.000 0;          /* base-100: white */
  --b2: 0.961 0.000 0;          /* base-200: off-white */
  --b3: 0.922 0.000 0;          /* base-300: light gray */
}

/* DaisyUI v4 constructs the full color via:
   background-color: oklch(var(--p))
   So the value stored is just "L C H" without oklch() wrapper */
```

---

## Building a Custom Color Palette

```ts
// Generate a balanced OKLCH palette from a single brand hue
function generatePalette(hue: number, chromaRange = { min: 0.04, max: 0.22 }) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  // Lightness mapping for each step
  const lightnessMap: Record<number, number> = {
    50: 0.975, 100: 0.950, 200: 0.905, 300: 0.850,
    400: 0.740, 500: 0.610, 600: 0.500, 700: 0.408,
    800: 0.308, 900: 0.215, 950: 0.145,
  }

  // Chroma peaks at mid-range, lower at extremes
  const chromaMap: Record<number, number> = {
    50: 0.02, 100: 0.04, 200: 0.08, 300: 0.13,
    400: 0.18, 500: 0.22, 600: 0.20, 700: 0.18,
    800: 0.14, 900: 0.10, 950: 0.06,
  }

  return steps.reduce((acc, step) => ({
    ...acc,
    [step]: `oklch(${lightnessMap[step]} ${chromaMap[step]} ${hue})`
  }), {})
}

// Usage:
const brandPalette = generatePalette(250)  // blue-violet brand hue
// → { 50: 'oklch(0.975 0.02 250)', 500: 'oklch(0.61 0.22 250)', ... }
```

---

## Common OKLCH Values Reference

```css
/* Grays (chroma = 0) */
oklch(1 0 0)      /* white */
oklch(0.985 0 0)  /* near-white (shadcn foreground-inverse) */
oklch(0.97 0 0)   /* light gray (secondary/muted bg) */
oklch(0.922 0 0)  /* border gray */
oklch(0.708 0 0)  /* medium gray (ring, muted text alt) */
oklch(0.556 0 0)  /* readable muted text */
oklch(0.274 0 0)  /* dark card bg */
oklch(0.205 0 0)  /* dark primary / dark card */
oklch(0.145 0 0)  /* near-black (page text light mode) */
oklch(0 0 0)      /* black */

/* Semantic colors */
oklch(0.577 0.245 27)    /* destructive red (light mode) */
oklch(0.704 0.191 22)    /* destructive red (dark mode — lighter) */
oklch(0.749 0.168 151)   /* success green */
oklch(0.795 0.184 86)    /* warning amber */
oklch(0.623 0.214 259)   /* info blue */
```
