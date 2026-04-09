---
name: motion-and-animation
description: Purposeful, accessible animation patterns — enter/exit transitions (Radix forceMount, data-state), duration guidelines per platform, reduced-motion compliance, Framer Motion composition, CSS-only recipes, spatial continuity. Use when adding animations or auditing motion design.
---

# Motion and Animation

Implementation patterns for purposeful, accessible animations. Synthesized from Radix UI, Chakra UI, and darwin-ui.

## When to Use

- Adding enter/exit transitions to overlays, modals, menus
- Implementing scroll-triggered animations
- Auditing animation duration and easing
- Ensuring reduced-motion compliance

## Duration Quick Reference

| Context | Duration | Platform |
|---------|----------|----------|
| Micro-interaction (hover, toggle) | 150ms | Web/macOS |
| Standard transition (expand, slide) | 250ms | Web/macOS |
| Max UI animation (modal, page) | 300ms | Web |
| Entrance animation | 180ms | iOS |
| Exit animation | 120ms | iOS |

## Key Principles

1. Motion conveys meaning — animate to show relationships, not to decorate
2. Spatial continuity — elements move to/from logical origins
3. One big moment > many small ones
4. Respect the system — honor prefers-reduced-motion always
5. Exit faster than enter

## References

Load: `references/exit-animations.md` — Radix forceMount, data-state, Chakra defineAnimationStyles
Load: `references/duration-guidelines.md` — Per-platform timing, easing, CSS-only recipes
Load: `references/reduced-motion.md` — prefers-reduced-motion compliance, alternatives
