---
name: desktop-web-design
description: Build native-feeling desktop web apps — glass-morphism, macOS window chrome, sidebar navigation, Framer Motion transitions, Electron/Tauri patterns. Use for admin dashboards, desktop-class web apps, and Electron/Tauri applications.
---

# Desktop Web Design

Patterns for building web applications that feel like native desktop software. Synthesized from darwin-ui.

## When to Use

- Building Electron or Tauri apps
- Creating admin dashboards with desktop-class feel
- Implementing glass-morphism UI
- Building apps with native window chrome
- Desktop-grade keyboard navigation

## Quick Reference

| Pattern | Key Concept |
|---------|-------------|
| Glass-morphism | backdrop-filter: blur() + saturate() + semi-transparent bg |
| Window Chrome | Traffic light buttons, draggable title bar (~50px zone) |
| Sidebar Nav | Toggleable, progressive disclosure, resizable panes |
| System Fonts | -apple-system, BlinkMacSystemFont, SF Pro stack |
| Dark Mode | data-theme attribute + CSS variables |
| Animations | Framer Motion for native-feeling transitions |
| Keyboard A11y | Radix + react-focus-lock for desktop-grade focus |
| Data Viz | Recharts with macOS-styled theming |

## Component Catalog (darwin-ui)

35+ components: Window, Card, Sidebar, Tabs, Accordion, buttons, inputs, selectors, controls, tables, badges, avatars, charts, modals, popovers, tooltips, context menus, toasts, alerts.

## References

Load: `references/glass-morphism.md` — Backdrop blur architecture, layer management, semantic color variables
Load: `references/window-chrome.md` — Traffic light buttons, title bar, toolbar, sidebar patterns
Load: `references/electron-tauri.md` — Integration patterns for Electron and Tauri desktop frameworks
