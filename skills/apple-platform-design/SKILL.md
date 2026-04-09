---
name: apple-platform-design
description: Design for macOS and iOS with HIG compliance — SF Pro typography, 8px grid, graduated corner radii, independent dark mode, vibrancy effects, touch targets, safe areas, Dynamic Type. Use for any Apple platform work including SwiftUI, Flutter macOS, and web apps targeting Apple aesthetic.
---

# Apple Platform Design

macOS and iOS Human Interface Guidelines for building platform-native experiences.

## When to Use

- Building macOS or iOS native apps (SwiftUI, UIKit, AppKit)
- Building Flutter macOS apps
- Building web apps with Apple-native aesthetic
- Auditing HIG compliance

## Quick Reference — macOS

| Property | Value |
|----------|-------|
| Body Font | SF Pro, 13px baseline |
| Grid | 8px foundation |
| Corner Radii | 10px windows, 8px cards, 6px buttons, 4px inputs |
| Dark Mode | Independent (not simple inversion) |
| Shadows | Micro: 0 0 0 0.5px for edge definition |
| Title Bar | ~50px draggable zone |
| Animation | 150ms fast, 250ms normal |

## Quick Reference — iOS

| Property | Value |
|----------|-------|
| Touch Target | 44pt minimum |
| Border Radius | 6pt standard |
| Safe Area | 34pt bottom padding |
| Color Model | 8 palettes |
| Typography | 22 styles, SF Pro, 11-34px |
| Animation | 180ms entrance, 120ms exit |
| Pressed State | 0.8 opacity |

## Liquid Glass

For iOS 26+ Liquid Glass patterns, use the standalone `liquid-glass-design` skill. The `references/liquid-glass.md` covers HIG integration points only.

## References

Load: `references/macos-hig.md` — Full macOS design language
Load: `references/ios-hig.md` — Full iOS design language
Load: `references/liquid-glass.md` — HIG integration points (defers to liquid-glass-design)
Load: `references/system-colors.md` — Apple semantic color system
