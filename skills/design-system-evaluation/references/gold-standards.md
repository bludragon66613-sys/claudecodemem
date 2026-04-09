# Gold Standard Design Systems — Deep Profiles

Eight systems that define the industry ceiling. Study these before building or evaluating any design system.

---

## 1. IBM Carbon Design System

**URL:** carbondesignsystem.com | **Source:** github.com/carbon-design-system/carbon

### What Makes It Exceptional
Carbon is the most systematically governed design system in the industry. Every component decision traces back to documented principles. IBM operates across finance, healthcare, government — all regulated environments — which forced Carbon to treat accessibility not as a checklist but as a structural requirement. The system has survived multiple major redesigns (v10 → v11) with published migration tooling and documented deprecation timelines.

### Key Architectural Decisions
- **Two token layers:** Carbon uses "core" tokens (brand-level primitives) and "theme" tokens (semantic mappings). This separation lets IBM build white-label versions for clients without touching component code.
- **Framework wrappers as first-class citizens:** React, Vue, Angular, Svelte, and Web Components are all maintained in-monorepo, eliminating the "React-first" problem most systems have.
- **Component status flags:** Every component has an explicit stability status (Experimental → Beta → Stable → Deprecated). This communicates risk to consumers before they adopt.
- **A11y annotations in Figma:** Every component specification includes annotated accessibility notes directly in the design file, not just in developer docs.

### What to Copy
- The RFC process for adding new components: a design proposal, accessibility review, and implementation plan are all required before work begins.
- The explicit deprecation lifecycle: deprecated components have a removal version number, migration documentation, and a codemod.
- Cross-framework parity as a requirement, not a nice-to-have.

### Accessibility Approach
Carbon maintains a dedicated a11y team that reviews every component. Tests use IBM Equal Access Checker (WCAG 2.1 AA + IBM accessibility guidelines). Keyboard interaction patterns are documented as interaction models before code is written, not audited after. Screen reader testing is done on VoiceOver, NVDA, and JAWS for every component milestone.

### Governance
Three-tier model: **Core team** (IBM employees), **Adopters** (product teams using Carbon), **Contributors** (external submitters). New patterns require a GitHub Discussion proposal → design review → a11y review → implementation → beta period → stable promotion. Estimated time: 6-12 weeks per new component.

---

## 2. Shopify Polaris

**URL:** polaris.shopify.com | **Source:** github.com/Shopify/polaris

### What Makes It Exceptional
Polaris has the best contribution guide in the industry. Shopify solved the "design system as ivory tower" problem by making contribution genuinely achievable for product engineers. The system is also notable for treating content — copywriting, microcopy, error messages — as a first-class design system concern.

### Key Architectural Decisions
- **Dedicated content guidelines:** Polaris has a full content section covering voice/tone, actionable language, error message formulas, and inclusive language. This is as detailed as the component documentation.
- **Component primitives vs composed patterns:** Polaris clearly separates low-level layout primitives (Box, InlineStack, BlockStack) from complex composed patterns (ResourceList, DataTable). The naming makes the abstraction level obvious.
- **Visual regression testing:** Every component has Percy snapshots. No PR can merge that introduces unintended visual changes.
- **Token system with semantic naming:** Polaris tokens use explicit semantic meaning (`--p-color-bg-surface-secondary`) rather than generic aliases, making intent clear.

### What to Copy
- The contribution guide structure: "When to contribute," "What makes a good addition," "How to propose," "How to implement," "How to get reviewed."
- The content guidelines: error message formula, actionable button copy rules, placeholder text guidance.
- The visual regression gate in CI.

### Accessibility Approach
WCAG 2.1 AA as minimum. Each component documents keyboard navigation explicitly in prose format ("Tab moves focus to the trigger; Enter or Space opens the menu; Arrow keys navigate options; Escape closes"). axe-core in CI blocks merges on violations.

### Governance
Shopify uses a "Consumer first, contributor second" model. Changes proposed by product engineers are reviewed by the Polaris core team within 2 business days. An RFC is required only for new patterns; bug fixes and minor improvements use a lighter review process.

---

## 3. Google Material Design

**URL:** m3.material.io | **Source:** github.com/material-components

### What Makes It Exceptional
Material is the only system at this scale that maintains genuine parity across Android (Jetpack Compose), iOS (Swift), Flutter, and Web simultaneously. The Material 3 (M3) redesign introduced dynamic color — algorithmically generating accessible 5-tone color palettes from a single seed color — which is technically novel and production-proven.

### Key Architectural Decisions
- **Dynamic color system:** A single `sourceColor` generates a complete tonal palette (primary, secondary, tertiary, error, neutral, neutral-variant) at 13 tones each. Dark mode is built into the algorithm, not bolted on.
- **Component states as a first-class system:** Material defines 5 interactive states (enabled, hovered, focused, pressed, dragged) with consistent opacity overlays per state. No per-component invention.
- **Elevation as semantic meaning:** In M3, elevation conveys hierarchy and interactivity — not decorative depth. Surface containers have defined elevation levels (0-5) with rules for when each level applies.
- **Platform-specific implementations under one spec:** Material Compose, Material iOS, and Material Web each implement the same specification but use platform idioms. Cross-platform consistency without forcing web patterns onto native.

### What to Copy
- The tonal palette generation approach for dynamic color.
- Component state overlay system (consistent opacity values across all interactive states).
- The split between specification (m3.material.io) and implementation (individual repos) — spec travels faster than code.

### Accessibility Approach
Minimum contrast ratios built into the dynamic color algorithm. Each tone step in the color palette is validated for 4.5:1 contrast against white or black. Touch target minimum 48dp on Android (verified at build time via Compose layout tests).

### Governance
Spec-driven: the material.io website is the source of truth. Implementation repos follow the spec. Component proposals go through Google's internal design review → public RFC → reference implementation period. External contributions accepted for Web components; native implementations are Google-owned.

---

## 4. Adobe Spectrum

**URL:** spectrum.adobe.com | **Source:** github.com/adobe/react-spectrum

### What Makes It Exceptional
Spectrum solves the hardest problem in enterprise design: complex, professional-grade tools used by power users for hours daily. The system is built for extreme density, keyboard-first workflows, and accessibility in tools where errors are costly (photo editing, video production, document creation). Adobe's React Aria and React Stately libraries are the most comprehensive accessible primitives library available — used beyond Spectrum by the entire industry.

### Key Architectural Decisions
- **React Aria as a separate layer:** Accessibility behavior (keyboard, ARIA, focus management) is completely decoupled from styling. React Aria can be used with any CSS system. This architecture decision has made Spectrum's accessibility work usable by Tailwind, Chakra, shadcn, and dozens of other systems.
- **S1/S2 generation system:** Spectrum has versioned "generations" (Spectrum 1, Spectrum 2) with explicit migration paths. This is how a design system ages gracefully.
- **International typography:** Spectrum supports CJK (Chinese, Japanese, Korean), Arabic (RTL), and Devanagari out of the box. Most systems treat internationalization as an afterthought.
- **High-density mode:** Compact variants for every component for power-user workflows that maximize screen real estate.

### What to Copy
- The React Aria/React Stately separation of concerns — behavior vs presentation is the right architectural split.
- The high-density mode pattern for data-heavy applications.
- Multi-generation versioning as a first-class concept.

### Accessibility Approach
Spectrum is the most accessibility-advanced system in the industry. React Aria implements the complete WAI-ARIA Authoring Practices Guide for every widget type. Testing spans VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome, TalkBack + Android Chrome. All keyboard interactions verified against ARIA APG specifications.

### Governance
Dual-track: Adobe internal (moves fast, production-tested) and open source (community PRs, public RFC discussions). React Aria proposals are reviewed for ARIA spec compliance before acceptance. Core team is 8-10 engineers with dedicated accessibility engineers.

---

## 5. Microsoft Fluent UI

**URL:** fluent2.microsoft.design | **Source:** github.com/microsoft/fluentui

### What Makes It Exceptional
Fluent is the only system that achieves genuine production quality across Windows (WinUI), macOS, iOS, Android, and Web simultaneously. Microsoft's scale (Office, Teams, Azure, Xbox) forced solutions to problems other systems can assume away: right-to-left languages, high contrast mode, operating system accessibility features (Windows High Contrast, forced colors).

### Key Architectural Decisions
- **Forced colors / high contrast mode support:** Fluent components work in Windows High Contrast Mode — a forced-color environment where the OS overrides all CSS colors. This requires carefully structuring CSS to use transparent borders and outline-based focus rings that survive forced color themes.
- **Theme as data, not code:** Fluent's theming system generates theme objects from token definitions that can be serialized to JSON and applied at runtime without recompilation.
- **Brand tokens as first-class:** The system separates Fluent brand tokens (Microsoft blue, etc.) from neutral tokens, making white-labeling predictable.
- **Accessibility variants:** Fluent ships multiple theme variants including a high-contrast dark theme and a high-contrast light theme alongside the standard themes.

### What to Copy
- Forced colors / Windows High Contrast Mode support patterns.
- The distinction between brand tokens and semantic tokens.
- The runtime theme switching architecture (no page reload, no style injection flash).

### Accessibility Approach
WCAG 2.1 AA + Microsoft internal accessibility requirements. Unique focus on screen magnification (Magnifier on Windows) and voice control (Dragon NaturallySpeaking). Every interactive element has a keyboard shortcut documentation requirement.

### Governance
Internal Microsoft teams have direct commit access; external contributions via PR with review from the Fluent team. Component proposals evaluated on platform reach (does it work on all 5 platforms?). The Fluent design council includes representatives from Office, Teams, Xbox, and Azure.

---

## 6. Atlassian Design System

**URL:** atlassian.design | **Source:** github.com/atlassian/design-system-mirror (mirror)

### What Makes It Exceptional
Atlassian's system excels at collaboration-focused patterns — real-time editing indicators, user presence, inline editing, and comment threads. These are the patterns that every B2B SaaS eventually needs and finds poorly documented elsewhere. The system is also notable for its semantic color model which cleanly separates "neutral" from "brand" from "status" (success/warning/danger/discovery).

### Key Architectural Decisions
- **Token naming as communication:** Atlassian tokens use a subject-property-variant naming scheme (`color.background.accent.blue.subtle`) that reads like structured prose. The naming itself documents intent.
- **Status colors as a spectrum:** Rather than just success/error/warning, Atlassian defines 5 accent color families (Blue/Red/Yellow/Green/Purple) with semantic mappings for different status types.
- **Layered surface model:** Background tokens are organized by surface depth — `elevation.surface`, `elevation.surface.raised`, `elevation.surface.overlay` — which solves the "what background do I use inside a modal?" problem.
- **Co-design artifacts:** Figma assets are versioned alongside code; a Figma variables library mirrors the token system directly.

### What to Copy
- The surface elevation token model.
- The structured token naming convention.
- Status color spectrum (5 families, each with bold/subtle variants).

### Accessibility Approach
WCAG 2.1 AA throughout. axe-core in CI. Unique focus on cognitive accessibility: consistent interaction patterns, predictable navigation, minimal animation by default.

### Governance
"Contribution ladder" model: Submit → RFC → Implementation → Review → Release. Design proposals require both a designer and engineer champion. Monthly design system office hours for contributor questions.

---

## 7. GitHub Primer

**URL:** primer.style | **Source:** github.com/primer/css, github.com/primer/react, github.com/primer/primitives

### What Makes It Exceptional
Primer is built for developers using a developer-focused product. This shapes every decision: monospace typography treated seriously, code diff views, syntax highlighting theming, keyboard-heavy workflows, and a color system designed to work in both the GitHub.com light/dark themes and repository-specific themes (e.g., GitHub Sponsors). Primer is also the reference implementation for CSS custom property-based theming that pre-dates shadcn's popularization of the pattern.

### Key Architectural Decisions
- **Primitives as a separate package:** `@primer/primitives` exports tokens in multiple formats (CSS variables, JavaScript objects, Figma tokens JSON) independently of any component library.
- **Color modes beyond dark/light:** Primer supports 7 color modes (light, dark, light-high-contrast, dark-high-contrast, light-colorblind, dark-colorblind, light-tritanopia, dark-tritanopia). This is the most comprehensive color mode system in any public design system.
- **Stack component for layouts:** Primer's Stack component handles most layout needs with directional, gap, and alignment props — avoiding the proliferation of one-off flexbox utilities.
- **Monospace stack:** Primer explicitly documents the monospace font stack and its sizing behavior, critical for a developer tool.

### What to Copy
- The multi-mode color system (colorblind + tritanopia variants).
- Separating tokens into their own versioned package.
- The monospace typography documentation.

### Accessibility Approach
GitHub.com has legal accessibility requirements. Primer tests in 8 theme modes. Focus visible polyfill for Safari. Every interactive pattern documents screen reader behavior with actual VoiceOver/NVDA tested copy.

### Governance
GitHub employees maintain Primer. External issues accepted; PRs require GitHub employee sponsorship. Roadmap is public on GitHub Projects. Deprecation notices published at least 2 major versions before removal.

---

## 8. Salesforce Lightning Design System

**URL:** lightningdesignsystem.com | **Source:** github.com/salesforce-ux/design-system

### What Makes It Exceptional
Lightning is the reference implementation for enterprise CRM UX at scale. Salesforce products are used by non-technical business users (sales reps, customer service agents) under time pressure in live customer interactions. This drives extreme focus on clarity, density, and error recovery. Lightning's Blueprint system — HTML/CSS component specifications independent of any JavaScript framework — is unique in allowing Salesforce to deliver components across its internal frameworks (Aura, LWC) and customer implementations simultaneously.

### Key Architectural Decisions
- **Blueprint as framework-agnostic spec:** Lightning publishes CSS blueprints that are framework-agnostic. Any Salesforce developer (Aura, LWC, React) implements the same visual design from the same CSS source.
- **Utility classes (SLDS):** Salesforce Lightning Design System utilities predate Tailwind and solve the same problem. Spacing, typography, and color utilities are prefixed `slds-` to prevent conflicts in customer environments.
- **AppExchange ecosystem:** Lightning must work when customers install third-party apps (AppExchange) into their Salesforce org. This means all tokens are namespaced and all styles are scoped to prevent leakage.
- **Touch + mouse dual mode:** Salesforce apps run on Salesforce1 (mobile) and desktop. Lightning documents touch target sizes and swipe gesture patterns alongside mouse interaction documentation.

### What to Copy
- The namespace scoping pattern for design systems that live in customer environments.
- The Blueprint approach: CSS spec first, framework implementation second.
- Dual touch/mouse interaction documentation.

### Accessibility Approach
Salesforce has Fortune 500 enterprise clients with legal accessibility obligations. WCAG 2.1 AA required. Each component documents both keyboard and screen reader behavior separately. Automated testing with IBM Equal Access Checker integrated into the LWC build pipeline.

### Governance
Salesforce UX core team owns Lightning. External contributions accepted for documentation fixes; component changes require Salesforce engineering review. Customer feedback captured through Trailhead community and a public Ideas board where feature requests receive votes.
