# Design System Maturity Model — 4-Pillar Scoring Rubric

## Overview

Rate each of the 4 pillars on a 0-3 scale. Sum for a total score (0-12).

| Score | Band | Interpretation |
|-------|------|----------------|
| 0-3 | Nascent | No coherent system; inconsistent UI patterns everywhere |
| 4-6 | Developing | Foundations exist but coverage is thin; governance missing |
| 7-9 | Mature | Solid, usable system; minor gaps in polish or process |
| 10-12 | Exemplary | Gold-standard tier; contributes to industry patterns |

---

## Pillar 1: Components

**What it covers:** Coded, interactive UI patterns delivered as a package or registry. Includes documentation with live examples, component API documentation, and accessible behavior by default.

### Scoring Rubric

| Score | Criteria |
|-------|----------|
| 0 | No coded components; styles-only or nothing at all |
| 1 | Some components exist, minimal docs, no live examples, inconsistent API |
| 2 | Comprehensive coverage (30+ components), good docs, live sandbox, consistent API surface |
| 3 | Exemplary: Storybook/sandbox with interaction tests, a11y annotations, changelog, migration guides, multiple framework targets |

### Evaluation Questions

1. How many components exist, and do they cover the product's actual UI surface (forms, data display, navigation, feedback, overlays)?
2. Does each component ship with live, interactive documentation showing all variants and states?
3. Is the component API consistent — same patterns for props, events, slots/children across components?
4. Are components tested for accessibility automatically (axe, jest-axe, Playwright a11y)?
5. Is there a versioned changelog and migration guide per release?

### Red Flags
- Components that exist in Figma only, not in code
- Docs that show screenshots instead of live examples
- No keyboard interaction documented
- Undocumented or inconsistent prop naming (`isDisabled` vs `disabled` vs `is_disabled`)
- No test coverage for interactive states

### Green Flags
- Storybook with `play()` functions that automate interaction testing
- Per-component ARIA role documentation
- Colocated `.test.tsx` files with 80%+ branch coverage
- Explicit `data-testid` or `data-component` attributes for E2E targeting
- Component changelog separate from package changelog

---

## Pillar 2: Voice and Tone

**What it covers:** Written communication guidance — editorial style, terminology, error message patterns, button/label copy, inclusive language rules. Differentiates systems that treat UI as a product from those that treat it as plumbing.

### Scoring Rubric

| Score | Criteria |
|-------|----------|
| 0 | No written content guidance; every team writes their own copy |
| 1 | A brief style guide exists but isn't enforced or well-maintained |
| 2 | Clear voice principles, error message templates, dos/don'ts for UI copy, terminology glossary |
| 3 | Exemplary: Content model with emotional tone mapping, inclusive language audits, accessibility writing guidelines, integration with linting (eslint-plugin-writing) |

### Evaluation Questions

1. Is there documented guidance for writing button labels, form placeholders, and error messages?
2. Does the system have an established voice (formal/informal, authoritative/collaborative) with clear examples?
3. Are there inclusive language standards (avoiding ableist/gender-exclusive terms)?
4. Is there a product terminology glossary (what is a "project" vs "workspace" vs "environment")?
5. Do error messages follow a consistent pattern (what happened, why, what to do next)?

### Red Flags
- Error messages that say "Error: 500" or "Something went wrong" with no guidance
- Different teams using different terms for the same concept in the UI
- No guidance on empty states or loading state microcopy
- Button labels that vary in capitalization style across the product

### Green Flags
- Documented emotional tone spectrum (e.g., "celebratory → informational → cautionary → urgent")
- Error message formula: `[What happened]. [Why]. [How to fix].`
- Named voice characteristics with anti-examples ("We say X, not Y")
- Content guidelines integrated into PR review checklist

---

## Pillar 3: Design Kits

**What it covers:** Figma or Sketch files that mirror the coded component library. Enables designers to work in the same vocabulary as engineers, reducing translation cost and drift.

### Scoring Rubric

| Score | Criteria |
|-------|----------|
| 0 | No design files shared; designers work independently from components |
| 1 | Figma files exist but are stale, not maintained, or not using Figma components/tokens |
| 2 | Maintained Figma library with components mirroring code, design token variables, documented |
| 3 | Exemplary: Bi-directional sync between Figma and code tokens (Token Studio/Style Dictionary), Figma community shared, design QA process, component coverage parity with code |

### Evaluation Questions

1. Is the Figma library public or accessible to all product teams?
2. Do Figma components use Auto Layout, variants, and boolean properties to reflect code component flexibility?
3. Are design tokens implemented as Figma Variables (not hardcoded fills) so theme switching works in design?
4. Is there a process for keeping design kits updated when components change?
5. Are there documentation frames in the Figma file that mirror the written component documentation?

### Red Flags
- Figma files that haven't been updated in 6+ months while code components evolved
- Hardcoded color values instead of token-linked Figma Variables
- No component variants for interactive states (hover, focus, disabled, error)
- Designers creating custom one-off patterns that don't exist in code

### Green Flags
- Figma file version history correlates with code releases
- Token Studio plugin syncing JSON tokens to Figma automatically
- Figma community file with 1000+ duplications (signals ecosystem health)
- Dedicated design QA checklist before feature ships (does implementation match design?)

---

## Pillar 4: Source Code

**What it covers:** Public or internally transparent code repository. Engineers can see implementation, file issues, contribute patterns, and learn from source. Transparency signals confidence and enables community.

### Scoring Rubric

| Score | Criteria |
|-------|----------|
| 0 | No accessible source; design system is a black box |
| 1 | Internal access only; no contribution process |
| 2 | Public or team-accessible repo, CONTRIBUTING.md, issue tracker linked to docs |
| 3 | Exemplary: RFC process for new components, contribution guide with commit standards, automated release notes, dependency audit CI, public roadmap |

### Evaluation Questions

1. Can engineers file bugs and feature requests against specific components?
2. Is there a documented contribution process (how to add a component, how to propose changes)?
3. Is the CI pipeline visible, and does it run a11y, visual regression, and unit tests?
4. Are dependencies audited for security and bundle size impact?
5. Is there a public roadmap or backlog showing what's planned?

### Red Flags
- No issue tracker; bugs reported via Slack or email
- Contribution process is "ask the design systems team"
- No CI/CD; releases are manual and infrequent
- Version pinning across the product is inconsistent because breaking changes aren't communicated

### Green Flags
- GitHub Discussions or RFC folder for design proposals
- Automated `size-limit` checks preventing bundle bloat
- `CHANGELOG.md` auto-generated from conventional commits
- Beta/canary release channel for consuming teams to test before stable

---

## Example Assessment: Hypothetical SaaS Product ("Acme Dashboard")

**Context:** A 4-year-old B2B analytics product. 12 engineers, 3 designers, 1 design systems engineer.

### Components — Score: 2/3
- 45 components exist in a private npm package. Storybook deployed internally.
- Live examples for all components, but only 20% have `play()` interaction tests.
- Keyboard documentation exists in Storybook args table but no ARIA role documentation.
- Consistent prop API (`onValueChange`, `defaultValue`, `isDisabled`).
- **Missing for 3:** No automated a11y testing in CI; migration guides are informal Slack threads.

### Voice and Tone — Score: 1/3
- A half-page style guide in Notion covers "be friendly, not formal."
- No error message templates; each engineer writes their own.
- Multiple terms for the same concept ("Report" vs "Dashboard" vs "View" used interchangeably).
- **Missing for 2:** Needs documented error formula, terminology glossary, and inclusive language review.

### Design Kits — Score: 2/3
- Figma library maintained by 1 designer, updated monthly.
- Uses Figma Variables for color tokens; spacing is still hardcoded.
- 35/45 components have Figma equivalents; 10 code components have no design counterpart.
- **Missing for 3:** Token Studio sync missing; spacing tokens not linked; 10 components unrepresented.

### Source Code — Score: 1/3
- Internal GitHub repo, accessible to all engineers.
- No CONTRIBUTING.md; contribution is "file a Jira ticket."
- No public roadmap.
- **Missing for 2:** Needs contribution guide, RFC template, and linked issue tracker.

### Total Score: 6/12 — Developing Band

**Top priorities to reach Mature (7-9):**
1. Add jest-axe to component test suite and block CI on a11y failures (Components → 3)
2. Write error message templates and terminology glossary (Voice & Tone → 2)
3. Create CONTRIBUTING.md with RFC template (Source Code → 2)
