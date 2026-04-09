---
name: design-token-engineering
description: Design and generate complete token systems — three-layer architecture (primitive/semantic/component), OKLCH color, Chakra recipe/slot-recipe patterns, DaisyUI semantic naming, CSS variable generation, W3C format. Supersedes design-system skill for token work.
---

# Design Token Engineering

Create, audit, and evolve design token systems. Synthesized from Chakra UI, DaisyUI, and shadcn/ui.

## When to Use

- Creating a token system from scratch
- Auditing token coverage and naming consistency
- Generating CSS variables from token definitions
- Implementing recipe/slot-recipe patterns for component variants
- Migrating between token formats (CSS vars, JSON, W3C DTCG)

## Quick Reference

| Pattern | Source | Key Concept |
|---------|--------|-------------|
| Three-Layer Tokens | All | Primitive -> Semantic -> Component hierarchy |
| OKLCH Colors | shadcn | Perceptually uniform, dark mode native |
| Semantic Naming | DaisyUI | primary/secondary/accent/neutral/base-N |
| Recipe Pattern | Chakra | Component styling as declarative data (CVA-like) |
| Slot-Recipe | Chakra | Multi-part component variant coordination |
| Derived Scales | shadcn | Single --radius generates sm/md/lg/xl |
| CSS Variable Gen | Chakra | Tokens -> --colors-bg-primary automatically |
| W3C DTCG Format | Standard | Interoperable token JSON schema |

## Note on Existing Skills

This skill supersedes `design-system` (ckm:design-system) for token architecture work. The existing skill remains valid for quick-reference auditing on the ui-ux-architect agent.

## References

Load: `references/token-architecture.md` — Three-layer system, naming conventions, scale generation, validation
Load: `references/oklch-color-system.md` — OKLCH format, perceptual uniformity, dark mode mapping, base color palettes
Load: `references/recipe-patterns.md` — Chakra recipe/slot-recipe, CVA integration, compound variants, declarative styling
