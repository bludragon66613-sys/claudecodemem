# Apple System Colors — Semantic Color Reference

Apple's semantic color system across macOS, iOS, and web. Covers light/dark token pairs, accent colors, dynamic UIColor, SwiftUI Color semantics, CSS mapping, and the 8-palette rationale.

---

## Why Semantic Colors

Never hard-code hex values in Apple platform code. Use semantic tokens that resolve automatically per:
- Color scheme (light/dark)
- Contrast preference (standard/increased contrast)
- Platform (macOS/iOS behave differently)

```swift
// WRONG
Text("Hello").foregroundColor(Color(hex: "#1C1C1E"))

// CORRECT
Text("Hello").foregroundColor(.primary)
```

---

## macOS Semantic Colors

### AppKit (`NSColor`)

```swift
// Text
NSColor.labelColor           // Primary text
NSColor.secondaryLabelColor  // Secondary text
NSColor.tertiaryLabelColor   // Placeholder-level
NSColor.quaternaryLabelColor // Disabled-level

// Control backgrounds
NSColor.controlBackgroundColor
NSColor.windowBackgroundColor
NSColor.underPageBackgroundColor

// Separators
NSColor.separatorColor
NSColor.gridColor

// Accent
NSColor.controlAccentColor   // User's chosen accent (blue by default)
NSColor.selectedContentBackgroundColor
NSColor.selectedControlColor
```

`NSColor.controlAccentColor` is the key API — it reads the user's system-level accent preference (blue, purple, pink, red, orange, yellow, green, graphite). Never assume blue.

### SwiftUI on macOS (`Color`)

```swift
Color.primary     // label / primary text
Color.secondary   // secondaryLabel
Color.accentColor // = controlAccentColor, user preference

// Background levels
Color(NSColor.windowBackgroundColor)
Color(NSColor.controlBackgroundColor)

// Use environment to read color scheme
@Environment(\.colorScheme) var colorScheme
// colorScheme == .dark or .light
```

### Light/Dark Token Pairs (macOS)

| Semantic Token | Light | Dark |
|----------------|-------|------|
| Background | `#ECECEC` | `#1E1E1E` |
| Control Background | `#FFFFFF` | `#282828` |
| Label | `rgba(0,0,0,0.85)` | `rgba(255,255,255,0.85)` |
| Secondary Label | `rgba(0,0,0,0.55)` | `rgba(255,255,255,0.55)` |
| Separator | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.10)` |
| Accent (default blue) | `#007AFF` | `#0A84FF` |

---

## iOS Semantic Colors

### UIKit (`UIColor`)

```swift
// Labels
UIColor.label               // Primary text — automatic light/dark
UIColor.secondaryLabel
UIColor.tertiaryLabel
UIColor.quaternaryLabel
UIColor.placeholderText

// Backgrounds (6 total)
UIColor.systemBackground     // Primary: white / near-black
UIColor.secondarySystemBackground  // Cards within screens
UIColor.tertiarySystemBackground   // Inputs within cards

UIColor.systemGroupedBackground
UIColor.secondarySystemGroupedBackground
UIColor.tertiarySystemGroupedBackground

// Fills (for control backgrounds)
UIColor.systemFill
UIColor.secondarySystemFill
UIColor.tertiarySystemFill
UIColor.quaternarySystemFill

// Tint / accent
UIColor.tintColor  // Inherits from UIView.tintColor up the hierarchy
```

### Dynamic UIColor (Custom Adaptive Colors)

Create colors that automatically resolve for light/dark mode:

```swift
let adaptiveColor = UIColor { traitCollection in
    if traitCollection.userInterfaceStyle == .dark {
        return UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
    } else {
        return UIColor(red: 0.97, green: 0.97, blue: 0.97, alpha: 1.0)
    }
}
```

Also supports increased contrast:
```swift
let adaptiveColor = UIColor { traits in
    switch (traits.userInterfaceStyle, traits.accessibilityContrast) {
    case (.dark, .high):   return UIColor(named: "darkHigh")!
    case (.dark, _):       return UIColor(named: "dark")!
    case (_, .high):       return UIColor(named: "lightHigh")!
    default:               return UIColor(named: "light")!
    }
}
```

### SwiftUI `Color` Semantics

```swift
// These are dynamic — correct light/dark values automatically
Color.primary         // = UIColor.label
Color.secondary       // = UIColor.secondaryLabel
Color.accentColor     // = app tint color

// Background levels
Color(.systemBackground)
Color(.secondarySystemBackground)
Color(.systemGroupedBackground)

// Semantic patterns
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Primary")
                .foregroundStyle(.primary)
            Text("Secondary")
                .foregroundStyle(.secondary)
        }
        .background(Color(.systemBackground))
    }
}
```

---

## The 8-Palette Rationale

iOS colors are organized into 8 palettes because each palette has a distinct semantic role:

| Palette | Role | Key Decision Point |
|---------|------|--------------------|
| 1. Accessible | Increased contrast variants | Check `accessibilityContrast` trait |
| 2. Adaptive (Default) | Standard semantic colors | Change with color scheme automatically |
| 3. Backgrounds | Screen layers | 3 levels: primary / secondary / tertiary |
| 4. Fills | Control chrome | 4 levels for different control prominence |
| 5. Labels | Text and icons | 4 levels of visual hierarchy |
| 6. Separators | Dividers | Translucent vs opaque variants |
| 7. Materials | Blur surfaces | 5 tiers from ultra-thin to ultra-thick |
| 8. App-specific | Tint / brand color | Flows through UIView.tintColor hierarchy |

This structure means you can audit any color decision against a checklist: which palette does this belong to? If it doesn't fit a palette, it's likely a hard-coded value that will break in dark mode.

---

## Flutter — `IosTheme.of(context)` and `MacosTheme.of(context)`

Flutter/macos_ui and flutter_platform_widgets expose platform theme contexts:

```dart
// macOS — macos_ui package
final theme = MacosTheme.of(context);
final accentColor = theme.accentColor;
final windowBackgroundColor = theme.windowBackgroundColor;

// iOS — cupertino
final cupertinoTheme = CupertinoTheme.of(context);
final primaryColor = cupertinoTheme.primaryColor;
final textTheme = cupertinoTheme.textTheme;
```

### InheritedWidget Pattern for Custom Theme Propagation

```dart
// Custom theme propagation via InheritedWidget
class AppColors extends InheritedWidget {
  final Color primary;
  final Color background;
  final Color label;
  final Color secondaryLabel;

  const AppColors({
    required this.primary,
    required this.background,
    required this.label,
    required this.secondaryLabel,
    required super.child,
    super.key,
  });

  static AppColors of(BuildContext context) {
    final result = context.dependOnInheritedWidgetOfExactType<AppColors>();
    assert(result != null, 'No AppColors found in context');
    return result!;
  }

  @override
  bool updateShouldNotify(AppColors oldWidget) =>
      primary != oldWidget.primary ||
      background != oldWidget.background;
}

// Usage
Widget build(BuildContext context) {
  final colors = AppColors.of(context);
  return Container(color: colors.background, ...);
}

// Provide — respond to brightness changes
Widget buildRoot(BuildContext context) {
  final brightness = MediaQuery.platformBrightnessOf(context);
  return AppColors(
    primary: brightness == Brightness.dark
        ? const Color(0xFF0A84FF)
        : const Color(0xFF007AFF),
    background: brightness == Brightness.dark
        ? const Color(0xFF000000)
        : const Color(0xFFFFFFFF),
    label: brightness == Brightness.dark
        ? const Color(0xFFFFFFFF)
        : const Color(0xFF000000),
    secondaryLabel: brightness == Brightness.dark
        ? const Color(0x99EBEBF5)
        : const Color(0x993C3C43),
    child: child,
  );
}
```

---

## CSS Mapping for Web

When building web apps with Apple aesthetic, map to CSS custom properties:

```css
/* Map Apple system colors to CSS — light mode */
:root {
  /* Labels */
  --apple-label: rgba(0, 0, 0, 1);
  --apple-secondary-label: rgba(60, 60, 67, 0.60);
  --apple-tertiary-label: rgba(60, 60, 67, 0.30);
  --apple-placeholder: rgba(60, 60, 67, 0.30);

  /* Backgrounds */
  --apple-bg-primary: #FFFFFF;
  --apple-bg-secondary: #F2F2F7;
  --apple-bg-tertiary: #FFFFFF;

  /* Fills */
  --apple-fill: rgba(120, 120, 128, 0.20);
  --apple-fill-secondary: rgba(120, 120, 128, 0.16);
  --apple-fill-tertiary: rgba(118, 118, 128, 0.12);

  /* Separators */
  --apple-separator: rgba(60, 60, 67, 0.29);
  --apple-opaque-separator: #C6C6C8;

  /* Accent (iOS blue default) */
  --apple-accent: #007AFF;
  --apple-accent-dark: #0A84FF;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --apple-label: rgba(255, 255, 255, 1);
    --apple-secondary-label: rgba(235, 235, 245, 0.60);
    --apple-tertiary-label: rgba(235, 235, 245, 0.30);
    --apple-placeholder: rgba(235, 235, 245, 0.30);

    --apple-bg-primary: #000000;
    --apple-bg-secondary: #1C1C1E;
    --apple-bg-tertiary: #2C2C2E;

    --apple-fill: rgba(120, 120, 128, 0.36);
    --apple-fill-secondary: rgba(120, 120, 128, 0.32);
    --apple-fill-tertiary: rgba(118, 118, 128, 0.24);

    --apple-separator: rgba(84, 84, 88, 0.65);
    --apple-opaque-separator: #38383A;

    --apple-accent: #0A84FF;
  }
}

/* DaisyUI/data-theme override */
[data-theme="ios-dark"] {
  --apple-bg-primary: #000000;
  --apple-label: rgba(255, 255, 255, 1);
  /* ... etc */
}
```

---

## Accent Color Hierarchy

On macOS, the accent color propagates through `NSView.tintColor`. On iOS, it propagates through `UIView.tintColor`. Always set accent at the root view, never hardcode deep in the tree.

```swift
// SwiftUI: set once at app root
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .tint(.blue)  // or your brand color
        }
    }
}
```

```swift
// UIKit: set on UIWindow
window.tintColor = UIColor.systemBlue  // or brand color
```

Deep views that need the accent color read it without knowing the actual value:
```swift
Color.accentColor   // resolves to whatever was set at root
UIColor.tintColor   // inherited from view hierarchy
```

---

## See Also

- `references/macos-hig.md` — macOS design tokens, dark mode patterns
- `references/ios-hig.md` — iOS 8-palette color model with full token values
- `references/liquid-glass.md` — Liquid Glass material system (iOS 26+)
