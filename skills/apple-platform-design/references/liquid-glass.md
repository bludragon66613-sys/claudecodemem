# Liquid Glass — HIG Integration Points

> This file covers Liquid Glass in the context of the broader Apple HIG and when to apply it. For full SwiftUI, UIKit, and WidgetKit implementation patterns, load the `liquid-glass-design` skill instead.

---

## What Is Liquid Glass

Liquid Glass is Apple's visual design language introduced in iOS 26 (WWDC 2025). It replaces flat translucency with a physically-based material that simulates light refracting through curved glass. The effect produces:

- Dynamic light distortion based on content behind the surface
- Specular highlights at material edges
- True transparency that adapts to underlying content color
- Fluid edge morphing when elements expand or reorder

It is the most significant HIG visual overhaul since iOS 7's flat design transition in 2013.

---

## HIG Evolution Context

| Era | Visual Language | Key Characteristic |
|-----|----------------|---------------------|
| iOS 6 and earlier | Skeuomorphic | Real-world textures, bevels, leather |
| iOS 7–14 | Flat / Translucency | Layers, blur, frosted glass (limited) |
| iOS 15–25 | Refined Translucency | Adaptive materials, vibrant content |
| iOS 26+ | Liquid Glass | Physically-based, refractive, morphing |

Liquid Glass does not replace all surfaces. It is applied selectively to navigation chrome (tab bars, toolbars, navigation bars), system overlays, and interactive controls. Content areas remain opaque.

---

## When to Use Glass vs Standard Materials

### Use Liquid Glass for:

- Navigation bars and toolbar buttons
- Tab bar items
- Floating action controls
- System overlays (alerts, sheets, popovers in iOS 26 HIG style)
- Controls that "float" above content (media scrubber, call controls)
- Contextual menus on iOS 26+

### Use Standard (Opaque/Blur) Materials for:

- Content containers (cards, lists, form sections)
- Primary action buttons (CTAs should remain solid for emphasis)
- Any surface where text readability is the priority
- Backgrounds and sidebars (use `.regularMaterial` vibrancy, not Liquid Glass)
- Widgets — WidgetKit has specific glass APIs; see `liquid-glass-design` skill

### Anti-Patterns to Avoid:

- Glass on primary action buttons (reduces affordance clarity)
- Stacking multiple glass layers directly on each other (creates visual noise)
- Using glass in content-dense areas where the refraction obscures readability
- Applying glass unconditionally regardless of OS version (iOS 25 and earlier don't support it)

---

## Integration with Existing Apple Platform Tokens

Liquid Glass respects the semantic color system defined in `references/system-colors.md`. The material tint layer reads from:

- `UIColor.tintColor` / `Color.accentColor` for colored glass variants
- The system background color family for neutral glass
- `colorScheme` (light/dark) for mode-adaptive rendering

The glass API does not expose direct color values — it samples the underlying content and composites automatically. Color customization happens through tint, not direct RGBA specification.

---

## OS Version Gating

Liquid Glass is iOS 26+ only. Always provide a fallback:

```swift
// SwiftUI: conditional glass application
if #available(iOS 26, *) {
    Button("Action") { }
        .buttonStyle(.glass) // Liquid Glass
} else {
    Button("Action") { }
        .buttonStyle(.borderedProminent) // Standard filled button
}
```

---

## For Full Implementation Patterns

The `liquid-glass-design` skill covers in depth:

- SwiftUI `.glassEffect()` modifier and `GlassEffectContainer`
- UIKit `UIGlassEffect` and `UIGlassLayer`
- WidgetKit glass containers
- Morphing animations between glass states
- Custom tint and shape configuration
- Interactive glass (pressed states, dynamic morphing)
- Performance and when to avoid the effect

Load it when you need to write actual Liquid Glass implementation code.

---

## See Also

- `references/ios-hig.md` — Base iOS design language (palette, typography, touch targets)
- `references/system-colors.md` — Semantic color tokens that glass materials inherit from
- `liquid-glass-design` skill — Full SwiftUI/UIKit/WidgetKit implementation reference
