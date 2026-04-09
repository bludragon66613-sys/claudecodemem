# Responsive Patterns

Building interfaces that work across all screen sizes. Mobile-first is the correct default — it's easier to add complexity for larger screens than to strip it out for smaller ones.

---

## Mobile-First Philosophy

Write styles for the smallest screen first. Add breakpoint modifiers to override for larger screens.

```css
/* WRONG: Desktop-first (override toward smaller) */
.card-grid {
  grid-template-columns: repeat(3, 1fr);  /* desktop default */
}
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;  /* override for mobile */
  }
}

/* CORRECT: Mobile-first (add for larger) */
.card-grid {
  grid-template-columns: 1fr;  /* mobile default */
}
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Why mobile-first:** Most users are on mobile. The mobile layout is the constraint — build the constrained version first, then progressively enhance. Also, CSS cascade means mobile-first tends to have fewer overrides.

---

## Tailwind Breakpoints

Tailwind's responsive modifiers are applied mobile-first. Unprefixed classes apply to all sizes.

| Prefix | Min-width | Typical target |
|--------|----------|----------------|
| (none) | 0px | Mobile portrait |
| `sm:` | 640px | Mobile landscape, small tablet |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Tablet landscape, small laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

### Basic Responsive Classes

```html
<!-- Single column on mobile, 3 columns on large screens -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ...
</div>

<!-- Stack vertically on mobile, row on tablet+ -->
<div class="flex flex-col md:flex-row gap-4">
  <Sidebar />
  <Main />
</div>

<!-- Hide on mobile, show on tablet+ -->
<nav class="hidden md:flex items-center gap-4">
  ...
</nav>

<!-- Show on mobile only (hamburger menu) -->
<button class="md:hidden">
  Menu
</button>

<!-- Text size scales with screen -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Heading
</h1>
```

### Responsive Padding / Spacing

```html
<!-- Tighter padding on mobile, more space on desktop -->
<section class="px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
  ...
</section>

<!-- Container with responsive padding -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  ...
</div>
```

---

## DaisyUI Responsive Variants

DaisyUI components support responsive modifiers for size and layout:

```html
<!-- Card layout: stacked on mobile, side-by-side on md+ -->
<div class="card md:card-side bg-base-100 shadow-xl">
  <figure class="md:w-48">
    <img src="cover.jpg" alt="cover" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card title</h2>
    <p>Content here</p>
  </div>
</div>

<!-- Responsive button sizes -->
<button class="btn btn-sm md:btn-md lg:btn-lg">
  Click me
</button>

<!-- Responsive navbar -->
<div class="navbar bg-base-100">
  <div class="flex-none">
    <!-- Mobile: show only when menu open -->
    <ul class="menu menu-sm dropdown-content">...</ul>
  </div>
  <!-- Desktop: always visible -->
  <div class="hidden md:flex flex-none">
    <ul class="menu menu-horizontal">...</ul>
  </div>
</div>
```

---

## Viewport Meta Tag

Required on every HTML page. Without this, mobile browsers render at desktop width and shrink it down.

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
```

**Never use:** `user-scalable=no` or `maximum-scale=1`. These disable pinch-to-zoom and are an accessibility violation — some users must zoom to read content.

---

## Preventing Horizontal Scroll

The most common mobile layout bug. Elements overflow their container, causing a horizontal scrollbar.

```css
/* Global overflow prevention */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}

/* Find the culprit element */
* {
  outline: 1px solid red;  /* Temporarily add to visualize all elements */
}

/* Common causes and fixes */

/* Fixed-width element wider than viewport */
.problem { width: 800px; }
.fix     { width: 100%; max-width: 800px; }

/* Element with padding pushing width over 100% */
.problem { width: 100%; padding: 0 20px; }  /* = 100% + 40px */
.fix     { width: 100%; padding: 0 20px; box-sizing: border-box; }
/* Or use: padding-inline instead */

/* Flex children not wrapping */
.problem { display: flex; }
.fix     { display: flex; flex-wrap: wrap; }

/* Pre/code blocks overflow */
pre {
  overflow-x: auto;  /* Scroll the code, not the page */
  white-space: pre;
  max-width: 100%;
}
```

### CSS Reset for Consistent Box Model

```css
*, *::before, *::after {
  box-sizing: border-box;  /* padding included in width, not added */
}
```

Tailwind applies this by default. Always include in custom CSS resets.

---

## Fluid vs Fixed Layouts

### Fixed Layout (Max-Width Constrained)

Content has a maximum width; whitespace fills the sides on wide screens.

```css
.container {
  max-width: 1280px;  /* or use a token */
  margin-inline: auto;
  padding-inline: 1rem;
}
```

Good for: Reading-focused content (articles, docs, forms), single-column pages.

### Fluid Layout (Full-Width)

Content stretches to fill available space. Used in dashboards where screen real estate matters.

```css
.dashboard {
  width: 100%;
  padding: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  /* sidebar is fixed, main area is fluid */
}
```

Good for: Dashboards, admin interfaces, data-heavy applications.

### Hybrid (Common for SaaS)

Fixed navigation, fluid content within a max-width container.

```html
<body>
  <header class="w-full border-b">
    <div class="max-w-screen-xl mx-auto px-6 flex items-center">
      <!-- Nav constrained but header spans full width -->
    </div>
  </header>
  <main class="max-w-screen-xl mx-auto px-6 py-8">
    <!-- Content constrained -->
  </main>
</body>
```

---

## Container Queries

Container queries let elements respond to their container's size, not the viewport. More precise than breakpoints for component-level responsive behavior.

```css
/* Define a containment context */
.card-container {
  container-type: inline-size;
  container-name: card;  /* optional name */
}

/* Style card based on its container width */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }

  .card-image {
    width: 40%;
    flex-shrink: 0;
  }
}

@container card (min-width: 600px) {
  .card-title {
    font-size: 1.5rem;
  }
}
```

**When to use container queries vs media queries:**
- Container queries: components that appear in different contexts (sidebar widget vs main content card)
- Media queries: page-level layout changes (1-column → 2-column → 3-column)

Tailwind v4 supports container queries via `@container` and responsive container variants.

---

## Responsive Typography with `clamp()`

`clamp(min, preferred, max)` creates fluid type that scales between viewport sizes without breakpoints.

```css
/* Font size: 1rem on smallest, scales up to 1.5rem on large */
h1 {
  font-size: clamp(1.5rem, 3vw + 1rem, 3rem);
}

/* How to read: clamp(minimum, fluid-value, maximum)
   - Never smaller than 1.5rem
   - Prefers 3vw + 1rem (grows with viewport)
   - Never larger than 3rem
*/

/* Practical type scale with clamp */
:root {
  --text-sm:   clamp(0.75rem, 1.5vw, 0.875rem);
  --text-base: clamp(0.875rem, 2vw, 1rem);
  --text-lg:   clamp(1rem, 2.5vw, 1.125rem);
  --text-xl:   clamp(1.125rem, 3vw, 1.25rem);
  --text-2xl:  clamp(1.25rem, 4vw, 1.5rem);
  --text-3xl:  clamp(1.5rem, 5vw, 2rem);
  --text-4xl:  clamp(2rem, 6vw, 3rem);
}
```

**Fluid spacing with clamp:**
```css
.section {
  padding-block: clamp(3rem, 10vw, 8rem);  /* generous padding that scales */
}
```

---

## Responsive Images

```html
<!-- Basic responsive image -->
<img src="photo.jpg" alt="Description" style="width: 100%; height: auto;" />

<!-- srcset for resolution switching (same image, different sizes) -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Description"
/>

<!-- picture element for art direction (different crops) -->
<picture>
  <source media="(max-width: 768px)" srcset="photo-square.jpg" />
  <source media="(min-width: 769px)" srcset="photo-wide.jpg" />
  <img src="photo-wide.jpg" alt="Description" />
</picture>

<!-- Next.js Image component (recommended for Next.js projects) -->
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

---

## Testing Responsive Layouts

### Chrome DevTools
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Select device preset or enter custom dimensions
3. Test at: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (desktop)

### Real Device Testing Priorities
1. iPhone SE (375px) — smallest common modern iPhone
2. iPhone 14 Pro (393px) — most common current iPhone
3. iPad (768px) — tablet portrait
4. MacBook 13" (1280px) — common laptop

### Common Breakpoint Test Checklist
- [ ] No horizontal scroll at any width
- [ ] Text remains readable (min 16px body text on mobile)
- [ ] Touch targets are 44px minimum on mobile
- [ ] Navigation collapses gracefully
- [ ] Images don't overflow containers
- [ ] Tables are scrollable or reformat for narrow screens
- [ ] Forms stack vertically on mobile

---

## Common Responsive Patterns

### Responsive Navigation

```html
<!-- Desktop: horizontal nav -->
<!-- Mobile: hidden, opens with hamburger -->
<nav>
  <!-- Always visible -->
  <div class="flex items-center justify-between">
    <Logo />
    <!-- Hamburger: mobile only -->
    <button class="md:hidden" aria-label="Open menu">
      <MenuIcon />
    </button>
  </div>

  <!-- Nav links: hidden on mobile, visible on desktop -->
  <!-- On mobile: shown/hidden via JS toggle -->
  <ul class="hidden md:flex gap-6" id="nav-menu">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### Responsive Card Grid

```html
<!-- 1 col → 2 col → 3 col -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Auto-fit: fills available space -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
  <!-- Cards auto-arrange based on container width -->
</div>
```

`auto-fit` with `minmax` is often better than explicit breakpoints for card grids — it handles arbitrary container widths gracefully.

### Sidebar + Content

```html
<!-- Mobile: stacked. Desktop: side by side. -->
<div class="flex flex-col lg:flex-row gap-8">
  <!-- Sidebar: full width on mobile, fixed width on desktop -->
  <aside class="w-full lg:w-64 flex-shrink-0">
    <SidebarContent />
  </aside>

  <!-- Main: full width on mobile, fills remaining space on desktop -->
  <main class="flex-1 min-w-0">
    <!-- min-w-0 prevents flex children from overflowing -->
    <MainContent />
  </main>
</div>
```

`min-w-0` on flex children is critical — without it, children don't shrink below their `min-content` size, causing overflow.
