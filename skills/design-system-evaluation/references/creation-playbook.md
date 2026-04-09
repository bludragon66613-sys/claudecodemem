# Design System Creation Playbook

Six phases from zero to a mature, governed design system. Realistic timelines included — most teams underestimate this by 3-5x.

---

## Phase 1: Audit Existing Patterns (Weeks 1-3)

**Goal:** Understand what exists before building anything new. A design system built without an audit will recreate existing inconsistencies in a shinier package.

### Steps

1. **Screenshot every screen in production.** Literally every screen. Sort into categories by interaction type (forms, tables, navigation, overlays, etc.).

2. **Inventory UI patterns.** Count how many variations of each pattern exist. You will find 7 button styles when you thought you had 3. This is normal. Document them all.
   - Buttons: variants (primary/secondary/ghost/danger), sizes, states (loading, disabled, icon)
   - Form inputs: text, select, checkbox, radio, date, file upload — note inconsistencies
   - Typography: how many distinct font sizes and weights are actually in production
   - Colors: extract all hex values in use; count how many there are vs how many there should be
   - Spacing: document the actual pixel values used for margins and padding

3. **Identify "load-bearing" patterns.** Some inconsistent patterns are fine to unify. Others exist for product reasons you haven't understood yet. Ask before fixing.

4. **Document technical dependencies.** What CSS framework? What component library (if any)? What bundler? These constrain your token architecture.

5. **Produce an audit report.** List the 5-10 most painful inconsistencies. Get stakeholder sign-off on what "done" looks like before starting Phase 2.

### Anti-Patterns to Avoid
- Starting token definitions during the audit (you don't have enough information yet)
- Trying to audit and build simultaneously (you'll anchor on the first patterns you see)
- Skipping the screenshot step because "we know the product" (you don't know it as well as you think)

### Timeline Reality
3 weeks for a product with 30+ screens. 1 week for a small app. Do not rush — every hour here saves 4 hours in Phase 3.

---

## Phase 2: Define the Token Foundation (Weeks 3-5)

**Goal:** Establish the vocabulary before writing any component code. Tokens are the contract between design and engineering.

### Three-Layer Architecture

```
Primitive tokens (brand-independent)
  --color-blue-500: #3b82f6
  --space-4: 16px
  --radius-md: 8px

Semantic tokens (intent-mapped)
  --color-action-primary: var(--color-blue-500)
  --space-component-padding: var(--space-4)
  --radius-component: var(--radius-md)

Component tokens (component-scoped, optional)
  --button-bg: var(--color-action-primary)
  --button-padding: var(--space-component-padding)
```

### Token Categories to Define

| Category | Examples | Notes |
|----------|---------|-------|
| Colors | Primitives (50 colors × 10 shades) + semantic names | Do OKLCH for dark mode correctness |
| Typography | Font family, size scale (10-11 steps), weights, line heights | Use a modular scale (1.25 or 1.333) |
| Spacing | 4px or 8px base unit, 8-10 stops | Must match the grid |
| Radii | 3-5 named sizes (none/sm/md/lg/full) | Derived from brand shape language |
| Shadows | 3-5 elevation levels | Avoid more than 5 |
| Z-index | Named layers (dropdown/modal/toast/tooltip) | Fixes z-index wars |
| Breakpoints | Mobile/tablet/desktop/wide | Must match CSS grid breakpoints |
| Duration | Fast/normal/slow for animation | Feeds into motion system |

### Dark Mode Strategy

Decide the dark mode strategy now — retrofitting it later is expensive:
- **Class-based:** `<html class="dark">` — easy to implement, good SSR support
- **Data-attribute:** `<html data-theme="dark">` — enables multiple themes beyond just dark
- **`prefers-color-scheme` only:** Automatic, but no user override. Rarely sufficient.

Recommendation: use `data-theme` with a FOUC-prevention inline script.

### Tooling Decision

| Need | Tool |
|------|------|
| Token authoring + export | Style Dictionary (JSON → CSS/JS/iOS/Android) |
| Figma sync | Token Studio (reads Style Dictionary JSON) |
| Simple CSS-only projects | Manually maintained CSS variables |

### Anti-Patterns to Avoid
- Building component-scoped tokens before semantic tokens exist (wrong order)
- Defining 50+ semantic tokens before you understand what components you're building
- Skipping the Figma Variables sync (designers will work around the system)

### Timeline Reality
2 weeks for a focused team of 2. Start with colors and spacing; add the rest iteratively.

---

## Phase 3: Build Core Components (Weeks 5-14)

**Goal:** Ship 10-15 essential components that cover 80% of your product's UI surface. Not all 50 components — the core 10-15.

### Essential Component Priority Order

Start here. These cover the majority of interactive UI surface:

1. **Button** — Primary, secondary, ghost, destructive, icon, loading state
2. **Input / TextField** — Text, number, with label, with helper, with error state
3. **Select / Dropdown** — Native or custom, keyboard navigable
4. **Checkbox** + **Radio Group** — Form primitives
5. **Dialog / Modal** — Focus trap, backdrop, accessible dismiss
6. **Tooltip** — Accessible, keyboard triggered
7. **Badge / Tag** — Status indicators, with remove
8. **Card** — Container with variants (elevated, outlined, flat)
9. **Table / DataGrid** — Sortable columns, pagination, row selection
10. **Navigation** — Sidebar or topnav, with active state
11. **Toast / Notification** — Accessible, auto-dismiss, stacking
12. **Avatar** — Image with fallback initials
13. **Loading** — Spinner and skeleton variants
14. **Empty State** — With illustration slot and call-to-action
15. **Form** — Wrapper handling validation layout

### Per-Component Requirements Checklist

Before calling any component "done":

- [ ] All visual variants implemented and documented
- [ ] All interactive states: hover, focus, active, disabled, loading, error
- [ ] Keyboard navigation documented and functional
- [ ] ARIA roles, attributes, and states present
- [ ] Screen reader tested (VoiceOver/NVDA at minimum)
- [ ] Dark mode works without additional props
- [ ] Responsive behavior defined
- [ ] Unit tests covering all variants and states
- [ ] Storybook story with all variant knobs exposed
- [ ] Consumer-facing API documented (props, events, slots)

### Component API Consistency Rules

Establish these conventions before building the first component:

```typescript
// Consistent naming across all components:
disabled?: boolean          // not isDisabled
loading?: boolean           // not isLoading
className?: string          // always a pass-through
onValueChange?(value: T)    // not onChange for controlled inputs
defaultValue?: T            // uncontrolled default
value?: T                   // controlled value
```

### Anti-Patterns to Avoid
- Building component 16 when component 10 isn't tested yet
- Different prop naming conventions across components (biggest long-term source of pain)
- Skipping the dark mode check until "we add dark mode later"
- Designing in isolation without checking against real product screens

### Timeline Reality
10 weeks for a focused 2-engineer team building 15 components properly (with accessibility). Budget 1.5 weeks per component on average; Button takes 1 day, DataGrid takes 2 weeks. Don't compress this timeline — compressed component work produces inaccessible, unstable foundations.

---

## Phase 4: Document and Publish (Weeks 14-17)

**Goal:** Make the system usable by people who weren't in the room when it was built.

### Documentation Structure

```
docs/
  getting-started/
    installation.md
    setup-tailwind.md        (or your CSS approach)
    dark-mode.md
    contributing.md
  components/
    button.md                (usage, props, examples, a11y notes)
    input.md
    ...
  tokens/
    colors.md
    spacing.md
    typography.md
  patterns/
    forms.md                 (combining primitives into form patterns)
    data-tables.md
    navigation.md
  changelog.md
  migration/
    v1-to-v2.md
```

### Documentation Quality Bar

Every component page must include:
- **Live example:** Rendered, interactive, copy-paste-ready code
- **Prop table:** Every prop with type, default, and description
- **Variants:** All visual states rendered (not just screenshots)
- **Usage guidance:** When to use this component; when to use something else
- **Accessibility notes:** Keyboard interactions, screen reader behavior
- **Do/Don't examples:** Common misuse patterns with corrected alternatives

### Publishing Options

| Approach | Pros | Cons |
|----------|------|------|
| Storybook (standalone) | Interactive, test integration, industry standard | Setup overhead, separate deployment |
| Docusaurus + live examples | Full MDX control, easy prose + code | More maintenance, less automatic |
| Astro Starlight | Fast, markdown-first, easy theming | Younger ecosystem |
| Internal wiki (Notion/Confluence) | Fast to start | No live examples, docs rot faster |

Recommendation for most teams: Storybook for component sandbox + a dedicated docs site for integration guides and design patterns.

### Anti-Patterns to Avoid
- Screenshots instead of live examples (screenshots rot; live examples stay honest)
- Documentation written only by engineers (designers must validate usage guidance)
- Publishing without a versioning strategy (what does a major version mean for this system?)

---

## Phase 5: Establish Governance (Weeks 17-20)

**Goal:** Define how the system grows, changes, and stays healthy without becoming a bottleneck.

### Governance Models

#### Centralized (1-2 person DS team)
- All changes go through the DS team
- High consistency, slow velocity
- Works for: Teams under 30 engineers

#### Federated (DS team + embedded contributors)
- Product engineers can contribute with DS team review
- Balanced consistency and velocity
- Works for: Teams of 30-150 engineers

#### Distributed (open contribution)
- Any engineer can PR; DS team does final review
- High velocity, requires strong automated guardrails
- Works for: Large orgs with strong DS culture

### RFC Process for New Patterns

Every new component or token set should go through an RFC. Lightweight version:

```markdown
## RFC: [Component Name]

**Problem:** What user/engineer need does this address?
**Proposed solution:** What should we build?
**Alternatives considered:** What else could work?
**Accessibility considerations:** ARIA role, keyboard nav, screen reader behavior
**Token impact:** Does this need new tokens?
**Breaking changes:** Does this affect existing consumers?
**Acceptance criteria:** How do we know when this is done?
```

RFC review: 48 hours for minor patterns, 5 business days for major patterns.

### Deprecation Process

1. Mark component as deprecated in documentation with `@deprecated` JSDoc tag
2. Add a deprecation notice in the component's Storybook story
3. Publish migration guide: "Replace `OldComponent` with `NewComponent`"
4. Keep deprecated component functional for 2 major versions
5. Remove with a codemod where possible

### Contribution Guide Structure

```
CONTRIBUTING.md
  When to contribute (vs when to file an issue)
  Setting up the development environment
  How to add a component
    - Required files
    - Required tests
    - Required documentation
    - PR template
  How to propose a new pattern (RFC process)
  Code review SLA (2 business days for maintainers)
  Release process
```

### Adoption Metrics to Track

| Metric | Signal |
|--------|--------|
| % of product UI using DS components | System coverage |
| Time-to-component for new engineers | Onboarding friction |
| # of one-off styles bypassing DS | Design debt accumulation |
| Component bundle size (weekly) | Performance health |
| Open GitHub issues (aging) | Responsiveness signal |
| PR review time (median) | Governance bottleneck |

---

## Phase 6: Iterate on Adoption (Ongoing)

**Goal:** Use data to drive system evolution rather than internal opinion.

### Adoption Strategies That Work

- **Office hours:** Weekly 30-minute drop-in for teams with design system questions. Prevents "I couldn't figure it out so I made my own" patterns.
- **Migration sprints:** Dedicated time (e.g., 1 week per quarter) for teams to migrate away from one-off patterns to design system components.
- **Component champions:** One engineer per product team who is the design system liaison. Channels feedback, teaches teammates, contributes back.
- **Showcase wins:** Publish case studies showing how using the DS reduced implementation time or fixed accessibility issues. Adoption is a product with a sales process.

### When to Cut a New Major Version

- Token naming convention changed (affects all consumers)
- Component API surface changed in a breaking way
- CSS variable names changed (affects custom overrides)

Major version signals: "There will be migration work. We will help you with a codemod and a guide."

### Governance Anti-Patterns That Kill Systems

| Anti-Pattern | Why It Kills |
|---|---|
| DS team as gatekeeper with no SLA | Teams stop asking, go around the system |
| Perfect as the enemy of good | Nothing ships, teams build their own |
| No adoption tracking | You don't know if it's working |
| Breaking changes without migration guides | Teams pin to old version forever |
| RFC process longer than 2 weeks | Proposals die, pattern stays ad-hoc |
| No contribution path for product teams | System stays small, DS team becomes bottleneck |
| Treating the DS as complete | All living systems need active gardening |

### Timeline Reality (Full Journey)

| Phase | Duration | Who |
|-------|---------|-----|
| Audit | 3 weeks | 1-2 people |
| Token foundation | 2 weeks | 1 DS eng + 1 designer |
| Core 15 components | 10 weeks | 2 DS engineers |
| Documentation | 3 weeks | 1 DS eng + 1 writer |
| Governance setup | 3 weeks | DS lead + eng manager |
| First adoption milestone (50% coverage) | 3-6 months after launch | Whole org |

Total: 4-5 months to launch, 12-18 months to reach Mature band. Systems that claim 6 weeks are usually token libraries, not design systems.
