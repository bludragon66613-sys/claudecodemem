---
name: cross-platform-theming
description: Implement theming across frameworks and platforms — scoped themes (data-theme), runtime switching, FOUC prevention, dark mode, semantic token mapping, framework-agnostic CSS variable systems. Use when adding dark mode, theme switching, or making themes portable.
---

# Cross-Platform Theming

Theming patterns that work across React, Vue, Svelte, and vanilla HTML. Synthesized from DaisyUI, Chakra UI, and Flowbite.

## When to Use

- Adding dark mode to any web project
- Implementing theme switching (light/dark/custom)
- Making themes work across multiple frameworks
- Preventing Flash of Unstyled Content (FOUC)
- Building multi-brand theme systems

## Quick Reference

| Pattern | Source | Key Concept |
|---------|--------|-------------|
| Scoped Themes | DaisyUI | data-theme attribute on any DOM subtree |
| 35 Built-in Themes | DaisyUI | Pre-built CSS variable sets |
| Semantic Token Map | Chakra | Multi-mode tokens (light/dark/high-contrast) |
| FOUC Prevention | shadcn | Early-execution script before DOM render |
| Meta Color Sync | shadcn | theme-color meta tag matches current theme |
| Theme Persistence | All | localStorage + prefers-color-scheme fallback |
| Plugin Config | DaisyUI | @plugin "daisyui" { themes: ... } |
| CSS Variable Runtime | All | Swap themes by changing CSS custom properties |

## References

Load: `references/scoped-themes.md` — DaisyUI data-theme, nested themes, compile-time generation
Load: `references/theme-switching.md` — FOUC prevention, persistence, meta color, system preference detection
Load: `references/framework-agnostic.md` — Same tokens across React/Vue/Svelte/vanilla, Tailwind integration
