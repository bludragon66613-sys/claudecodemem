# Spatial Composition

The principles that make the difference between a layout that looks "designed" and one that looks assembled. Covers grid systems, visual hierarchy through space, information density, and the three content states every screen must handle.

---

## The 8px Grid System

Every spacing decision derives from an 8px base unit. This creates visual harmony because all values are mathematically related.

### Standard Scale

| Token | Value | Use |
|-------|-------|-----|
| 1 | 8px | Fine adjustments, icon padding, tight gaps |
| 2 | 16px | Component internal padding, small gaps |
| 3 | 24px | Section gaps, form field spacing |
| 4 | 32px | Card padding, major component gaps |
| 5 | 40px | Section breaks within a page |
| 6 | 48px | Section padding (top/bottom) |
| 8 | 64px | Major section separators |
| 12 | 96px | Hero section padding, large breakouts |
| 16 | 128px | Page-level top padding (landing pages) |

### 4px Half-Grid

For fine adjustments that need to sit between 8px stops:

```css
/* 4px: icon-to-label gap, badge padding, inline spacing */
.icon-label { gap: 4px; }
.badge      { padding: 2px 6px; }  /* 2px uses 2px grid (half of 4px) */

/* Never use arbitrary values like 3px, 7px, 11px */
/* Always pick the nearest 4px or 8px value */
```

**Rule:** If a value isn't on the 4px grid, question it. There's almost always a nearby value that's just as correct and maintains the grid.

### Why 8px and not 10px

10px feels natural (base 10 math), but 8px maps better to common screen sizes:
- 8 divides evenly into 16, 32, 64, 128, 256, 512 — all common layout values
- 8 is the default `font-size` / 2 and lines up with `rem` at default settings
- Most design tools (Figma) default to 8px grid nudges

---

## Asymmetry, Overlap, and Diagonal Flow

Symmetrical layouts feel safe but static. Asymmetry creates tension and guides the eye.

### Asymmetric Spacing

Different amounts of space on opposing sides creates visual direction.

```css
/* Symmetric (static, balanced, forgettable) */
.card { padding: 32px; }

/* Asymmetric (directional, interesting) */
.card {
  padding-top: 48px;
  padding-bottom: 32px;
  padding-left: 40px;
  padding-right: 24px;
}
```

Asymmetric padding implies the card "leans" toward its lighter side — use this to direct attention toward content on that side.

### Overlapping Elements

Elements that overlap break the rigid grid and suggest three-dimensional layering.

```css
/* Card image overlaps card top border */
.card {
  position: relative;
  padding-top: 80px;  /* leave room for overlapping image */
}

.card-image {
  position: absolute;
  top: -40px;         /* pulls image 40px above card */
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;  /* border prevents bleed into background */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Diagonal Flow Techniques

1. **Angled section dividers:** Use `clip-path` to cut sections at an angle instead of a straight line.
   ```css
   .hero {
     clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
     padding-bottom: 120px;  /* extra space for the angled cut */
   }
   ```

2. **Rotated accent elements:** Slightly rotated cards or elements (1-5°) suggest dynamism.
   ```css
   .accent-card {
     transform: rotate(-2deg);
   }
   .accent-card:hover {
     transform: rotate(0deg);  /* straightens on hover for satisfaction */
   }
   ```

3. **Offset grid:** Place elements on a 2/3 + 1/3 grid instead of equal columns.

---

## Negative Space as Premium Signal

Empty space is not wasted space. In premium design, generous empty space signals confidence and quality.

### The Apple Principle

Apple's product pages use extreme amounts of negative space. A product image surrounded by 200px of white space says "this object is worth contemplating." Dense layouts say "there's so much here, quick, look at it all."

### Negative Space Implementation

```css
/* Standard SaaS (feels productive) */
.hero { padding: 64px 0; }

/* Premium (feels considered) */
.hero { padding: 120px 0; }

/* Flagship landing page (feels exceptional) */
.hero { padding: 160px 0 200px; }
```

### When to Use Generous Space

- Marketing/landing pages (convert from consideration, not urgency)
- Flagship product showcases
- Pricing pages (space around pricing signals premium)
- Empty states (covered below)

### When NOT to Use Generous Space

- Data-dense dashboards (space wastes screen real estate users paid for)
- Long-form tables
- Admin interfaces
- Any context where the user is in "work mode" rather than "evaluation mode"

---

## Controlled Density for Dashboards

Dense layouts work for dashboards because the user's mental model is "I need to see as much at once as possible." But density without control creates noise.

### Information Density Tiers

**Marketing / Landing Page**
- Line height: 1.6-1.8
- Paragraph max-width: 65ch
- Section padding: 120-160px top/bottom
- Card gap: 32-48px
- Goal: guide one action, make one impression

**Dashboard / Admin**
- Line height: 1.4-1.5
- Table row height: 40-48px
- Section padding: 24-32px
- Card gap: 16-24px
- Goal: maximum data per viewport, scannable

**Mobile**
- Line height: 1.5-1.6
- Touch target: 44px minimum height
- Section padding: 64-96px
- Card gap: 16px
- Goal: single-column clarity, thumb-reachable interactions

### Density Control Patterns

```css
/* Row density for data tables */

/* Compact (dense) */
.table-row-compact { padding: 8px 16px; line-height: 1.3; }

/* Default */
.table-row-default { padding: 12px 16px; line-height: 1.5; }

/* Comfortable (roomy) */
.table-row-comfortable { padding: 16px 16px; line-height: 1.6; }
```

Offer a density toggle in data-heavy UIs. Users have different preferences and screen sizes.

---

## Empty State Design

Every screen that can have no content must have a designed empty state. An empty state is a first-impression moment — it should guide the user's next action, not just show blankness.

### Empty State Formula

```
[Illustration or Icon]
[Descriptive Headline] — What state is this?
[Supportive body copy] — Why is it empty? What could go here?
[Primary CTA button] — What should the user do now?
[Optional secondary link] — Learn more / watch tutorial
```

### Empty State Examples

**First-time empty (nothing created yet):**
```
[Team icon illustration]
No team members yet
Invite your colleagues to collaborate on projects together.
[+ Invite team member]    [Learn about teams →]
```

**Empty after filtering (no results):**
```
[Search/filter icon]
No results for "annual report"
Try adjusting your filters or search with different terms.
[Clear filters]    [Try "report" instead →]
```

**Empty due to permissions:**
```
[Lock icon]
You don't have access to this view
Contact your admin to request access to the Projects section.
[Request access]
```

### Empty State Design Rules

1. **Never show a blank div.** Even "no items" deserves words.
2. **Make the CTA specific.** "Create your first project" beats "Get started."
3. **Illustration should be simple and on-brand.** 60-100px, flat/linear style. Not a stock photo.
4. **Don't apologize.** "Nothing here" is fine. "Unfortunately, there's nothing here" is not.
5. **Keep it short.** Headline + 1 sentence + CTA. Users scan, not read.

### Empty State Sizes

```css
/* Full-page empty state (main content area) */
.empty-state-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  min-height: 400px;
}

/* In-panel empty state (table, sidebar, small section) */
.empty-state-panel {
  padding: 40px 24px;
  text-align: center;
}

/* Inline empty state (search results list) */
.empty-state-inline {
  padding: 24px;
  text-align: center;
}
```

---

## Loading States

**Prefer skeleton screens over spinners.** Skeletons show the shape of the content about to arrive, which reduces perceived wait time and prevents layout shift.

### Skeleton Screen Pattern

```html
<!-- Match the shape of the real content -->
<div class="card skeleton">
  <div class="skeleton-image"></div>
  <div class="skeleton-body">
    <div class="skeleton-line" style="width: 70%"></div>
    <div class="skeleton-line" style="width: 90%"></div>
    <div class="skeleton-line" style="width: 50%"></div>
  </div>
</div>
```

```css
.skeleton-line,
.skeleton-image {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-image {
  height: 200px;
  border-radius: 8px;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .skeleton-line,
  .skeleton-image {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #3a3a3a 50%,
      #2a2a2a 75%
    );
  }
}
```

### When to Use Spinner vs Skeleton

| Situation | Use |
|-----------|-----|
| Page section loading for the first time | Skeleton |
| Table/list loading for the first time | Skeleton |
| Action in progress (saving, submitting) | Spinner on the button/action |
| Background refresh (auto-reload) | Subtle top progress bar |
| File upload in progress | Progress bar with percentage |
| Unknown end time | Indeterminate spinner |

**Never show a full-page spinner for content loads.** Use skeleton screens.

---

## Error States

Error states must be: **near-field, specific, and actionable.**

### Near-Field

The error should appear near the thing that caused it. A form field error should be below that field, not in a toast. A failed table load should appear in the table area, not in a corner notification.

```html
<!-- WRONG: Remote error for a local problem -->
<Toast type="error">Email is required</Toast>

<!-- CORRECT: Near-field error -->
<div class="form-field">
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="field-error" role="alert">
    Email is required. Enter your email address to continue.
  </span>
</div>
```

### Specific

"Something went wrong" is not an error message. Name the thing that failed.

```
WRONG: An error occurred. Please try again.
RIGHT: Couldn't save your changes. Your session may have expired.
       [Sign in again]  [Copy your work]
```

### Actionable

Every error should give the user a next step. If the error is recoverable, provide the recovery action. If not, say what to do next.

```
Network error:
"Unable to load reports. Check your internet connection and try again."
[Retry]

Permission error:
"You don't have permission to delete this item. Contact your admin."
[Request permission]

Not found error:
"This project no longer exists or has been moved."
[Go back]  [Search for it]

Server error:
"Something went wrong on our end. We've been notified."
[Try again]  [Report an issue]
```

### Error State Visual Design

```css
/* Error message (field-level) */
.field-error {
  display: block;
  margin-top: 4px;
  font-size: 0.875rem;
  color: var(--color-error);  /* red-600 equivalent */
  /* Don't use red background — keep it subtle */
}

/* Error state on field */
input[aria-invalid="true"] {
  border-color: var(--color-error);
  box-shadow: 0 0 0 1px var(--color-error);
}

input[aria-invalid="true"]:focus {
  outline: 2px solid var(--color-error);
  outline-offset: 2px;
}

/* Inline error card (table/panel load failure) */
.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
  color: var(--color-text-secondary);
}
```

---

## Touch Targets

Small targets cause misclicks, frustration, and accessibility failures. Touch targets must be large enough for reliable tapping.

### Platform Requirements

| Platform | Minimum Target Size | Source |
|----------|-------------------|--------|
| Apple (iOS/macOS) | 44pt × 44pt | Apple HIG |
| Android / Material | 48dp × 48dp | Material Design |
| Web (general) | 44px × 44px | WCAG 2.5.5 (Level AAA) |
| Web (minimum) | 24px × 24px | WCAG 2.5.8 (Level AA, WCAG 2.2) |

**Practical recommendation:** 44px as your web minimum. WCAG 2.5.8 at Level AA is the new baseline as of WCAG 2.2.

### Implementation

```css
/* Ensure button meets minimum touch target */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 10px 20px;   /* padding contributes to touch target */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* For small visual elements with invisible hit areas */
/* (icon buttons that look small but need large hit area) */
.icon-button {
  position: relative;
  width: 20px;
  height: 20px;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -12px;  /* expands hit area to 44x44 without changing visual size */
}

/* Using padding approach (simpler) */
.icon-button {
  padding: 12px;
  /* visual icon is 20px, total tappable area = 20 + 24 = 44px */
}
```

### Touch Target Spacing

Adjacent touch targets need spacing to prevent misclicks:

```css
/* Apple HIG: 8px spacing between adjacent targets */
.button-group {
  display: flex;
  gap: 8px;
}

/* Material: at least 8dp spacing */
.fab-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

### Auditing Touch Targets

In Chrome DevTools:
1. Open DevTools → Issues panel
2. Issues labeled "Touch Target Size" identify elements below the threshold

Or use the Accessibility Insights for Web extension — it has a dedicated touch target check.
