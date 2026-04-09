---
name: web-component-patterns
description: Component library architecture patterns from shadcn/ui and Flowbite — registry systems, CVA variant composition, data-attribute APIs, copy-paste distribution, and framework wrappers. Use when choosing component library patterns, building registries, or implementing variant systems.
---

# Web Component Patterns

Architecture patterns for building and consuming web component libraries. Synthesized from shadcn/ui and Flowbite.

## When to Use

- Choosing between component library approaches (copy-paste vs package)
- Building a component registry with CLI tooling
- Implementing variant systems (sizes, colors, states)
- Creating framework-agnostic interactive components
- Wrapping components for multiple frameworks

## Quick Reference

| Pattern | Source | Use When |
|---------|--------|----------|
| Copy-Paste Registry | shadcn/ui | Components live in your codebase, full customization |
| CVA Variants | shadcn/ui | Multi-dimensional component variants (size x color x style) |
| cn() Utility | shadcn/ui | Merging Tailwind classes without conflicts |
| Data-Attribute API | Flowbite | Framework-agnostic interactive components |
| Dual-API | Flowbite | Declarative HTML + imperative JS for same component |
| Framework Wrapper | Flowbite | Same core component, React/Vue/Svelte bindings |
| Component Tiers | Both | Primitive -> Compound -> Complex classification |

## Component Catalogs

- **shadcn/ui**: 70+ components (Button, Card, Dialog, Form, DataTable, Chart, Sidebar, etc.)
- **Flowbite**: 56+ components (Navbar, Modal, Dropdown, Datepicker, Tooltip, Accordion, etc.)

## References

Load: `references/shadcn-registry.md` — Registry JSON schema, CLI architecture, dependency resolution, namespaced registries
Load: `references/cva-variants.md` — CVA pattern, cn() utility, variant composition, defaultVariants, compound variants
Load: `references/flowbite-data-api.md` — Data-attribute initialization, programmatic API, framework integration
