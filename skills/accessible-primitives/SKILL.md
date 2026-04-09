---
name: accessible-primitives
description: Build accessible UI components using Radix-style compound component patterns, WAI-ARIA authoring practices, focus management, and state-machine-driven accessibility. Use when building interactive components, adding a11y to existing UI, or implementing overlays/modals/menus.
---

# Accessible Primitives

Patterns for building accessible, composable UI components. Synthesized from Radix UI and Chakra/Ark (Zag.js).

## When to Use

- Building interactive components (dialogs, menus, tabs, accordions, selects)
- Adding accessibility to existing UI
- Implementing overlays, modals, popovers, tooltips
- Keyboard navigation and focus management
- Screen reader optimization

## Quick Reference

| Pattern | Use When | Key Concept |
|---------|----------|-------------|
| Compound Components | Building multi-part UI (dialog, menu) | Root/Trigger/Content decomposition |
| asChild | Avoiding wrapper div pollution | Polymorphic rendering via child delegation |
| Roving Tabindex | Keyboard-navigated lists/grids | Single tab stop, arrow keys navigate |
| Focus Trapping | Modal overlays | Background becomes inert |
| Data-State Styling | Styling based on component state | `data-state="open\|closed"` attributes |
| Portal Rendering | Overlays that escape layout | Render into document.body |
| Uncontrolled Default | Reducing consumer boilerplate | Internal state with optional controlled override |
| State Machine A11y | Complex interactive widgets | Zag.js FSM bakes a11y into transitions |

## Widget Catalog (15+ WAI-ARIA patterns)

Dialog, Alert Dialog, Dropdown Menu, Context Menu, Menubar, Navigation Menu, Tabs, Accordion, Select, Combobox, Popover, Tooltip, Hover Card, Slider, Switch, Checkbox, Radio Group, Toggle, Toggle Group, Toast, Scroll Area

## References

Load on demand for implementation depth:

Load: `references/compound-components.md` — Root/Trigger/Content pattern, asChild, slot rendering
Load: `references/wai-aria-patterns.md` — Per-widget ARIA roles, states, keyboard interactions
Load: `references/focus-management.md` — Focus trapping, roving tabindex, portal focus, dismiss callbacks
