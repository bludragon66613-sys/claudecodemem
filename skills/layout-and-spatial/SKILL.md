---
name: layout-and-spatial
description: Spatial composition, layout primitives, responsive patterns, grid systems, content states (empty/loading/error), touch targets, information density. Use for layout decisions, responsive design, and spatial composition across platforms.
---

# Layout and Spatial

Patterns for building spatial compositions that guide the eye and adapt across viewports.

## When to Use

- Making layout decisions (flex vs grid vs stack)
- Implementing responsive designs
- Designing empty, loading, and error states
- Setting up grid systems
- Managing information density

## Quick Reference

| System | Value | Use |
|--------|-------|-----|
| Base Grid | 8px | Universal (web + Apple) |
| Half Grid | 4px | Fine adjustments |
| Column Grid | 12-column | Web layouts |
| Apple Touch | 44pt min | iOS/macOS targets |
| Material Touch | 48dp min | Android targets |
| Web Interactive | 44px recommended | Web click targets |

## Layout Primitives (Chakra Pattern)

| Primitive | Purpose |
|-----------|---------|
| Box | Base container, all style props |
| Flex | Flexbox container |
| Grid | CSS Grid container |
| Stack/VStack | Vertical stacking with gap |
| HStack | Horizontal stacking |
| Container | Centered max-width wrapper |

## Content States

Every screen needs: empty (guide first action), loading (skeleton/spinner), error (helpful, near-field).

## References

Load: `references/layout-primitives.md` — Box/Flex/Grid/Stack, style props, responsive arrays
Load: `references/responsive-patterns.md` — Mobile-first, Tailwind modifiers, DaisyUI variants
Load: `references/spatial-composition.md` — Asymmetry, density, negative space, content states
