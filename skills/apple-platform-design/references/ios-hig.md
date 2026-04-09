# iOS HIG — Design Language Reference

Full iOS Human Interface Guidelines implementation reference: 8-palette color model, 22 typography styles, touch targets, safe areas, animation timing, Dynamic Type, modal sheets, tab bars.

---

## 8-Palette Color Model

iOS organizes colors into 8 semantic palettes. Use palette names when specifying colors — not raw hex values.

### Palette 1: Accessible Colors
High-contrast versions of standard colors, activated by the Increase Contrast accessibility setting.

| Color | Default | Accessible |
|-------|---------|------------|
| Blue | `#007AFF` | `#0040DD` |
| Red | `#FF3B30` | `#D70015` |
| Green | `#34C759` | `#248A3D` |
| Orange | `#FF9500` | `#C93400` |
| Yellow | `#FFCC00` | `#946800` |
| Purple | `#AF52DE` | `#7928A1` |
| Pink | `#FF2D55` | `#C9002A` |
| Teal | `#5AC8FA` | `#0071A4` |

### Palette 2: Default / Adaptive Colors
These change automatically between light and dark mode.

```swift
// SwiftUI
Color.blue       // Adaptive: #007AFF light, #0A84FF dark
Color.red        // Adaptive: #FF3B30 light, #FF453A dark
Color.green      // Adaptive: #34C759 light, #30D158 dark
Color.orange     // Adaptive: #FF9500 light, #FF9F0A dark
```

```css
/* Web CSS equivalents — approximate; use system-colors when possible */
:root {
  --ios-blue: #007AFF;
  --ios-red: #FF3B30;
  --ios-green: #34C759;
  --ios-orange: #FF9500;
  --ios-yellow: #FFCC00;
  --ios-purple: #AF52DE;
  --ios-pink: #FF2D55;
  --ios-teal: #5AC8FA;
}
[data-theme="dark"] {
  --ios-blue: #0A84FF;
  --ios-red: #FF453A;
  --ios-green: #30D158;
  --ios-orange: #FF9F0A;
  --ios-yellow: #FFD60A;
  --ios-purple: #BF5AF2;
  --ios-pink: #FF375F;
  --ios-teal: #64D2FF;
}
```

### Palette 3: Backgrounds

| Token | Light | Dark |
|-------|-------|------|
| systemBackground | `#FFFFFF` | `#000000` |
| secondarySystemBackground | `#F2F2F7` | `#1C1C1E` |
| tertiarySystemBackground | `#FFFFFF` | `#2C2C2E` |
| systemGroupedBackground | `#F2F2F7` | `#000000` |
| secondarySystemGroupedBackground | `#FFFFFF` | `#1C1C1E` |
| tertiarySystemGroupedBackground | `#F2F2F7` | `#2C2C2E` |

### Palette 4: Fills
Used for control backgrounds (switches, text fields, buttons).

| Token | Light | Dark |
|-------|-------|------|
| systemFill | `rgba(120,120,128,0.20)` | `rgba(120,120,128,0.36)` |
| secondarySystemFill | `rgba(120,120,128,0.16)` | `rgba(120,120,128,0.32)` |
| tertiarySystemFill | `rgba(118,118,128,0.12)` | `rgba(118,118,128,0.24)` |
| quaternarySystemFill | `rgba(116,116,128,0.08)` | `rgba(116,116,128,0.18)` |

### Palette 5: Labels

| Token | Light | Dark |
|-------|-------|------|
| label | `rgba(0,0,0,1.0)` | `rgba(255,255,255,1.0)` |
| secondaryLabel | `rgba(60,60,67,0.60)` | `rgba(235,235,245,0.60)` |
| tertiaryLabel | `rgba(60,60,67,0.30)` | `rgba(235,235,245,0.30)` |
| quaternaryLabel | `rgba(60,60,67,0.18)` | `rgba(235,235,245,0.18)` |
| placeholderText | `rgba(60,60,67,0.30)` | `rgba(235,235,245,0.30)` |

### Palette 6: Separators

| Token | Light | Dark |
|-------|-------|------|
| separator | `rgba(60,60,67,0.29)` | `rgba(84,84,88,0.65)` |
| opaqueSeparator | `#C6C6C8` | `#38383A` |

### Palette 7: Materials / Blur
iOS materials combine blur + color tint for vibrancy effects:
- `.ultraThinMaterial` — most transparent, highest blur
- `.thinMaterial`
- `.regularMaterial` — standard popover/sheet
- `.thickMaterial`
- `.ultraThickMaterial` — least transparent

### Palette 8: App-Specific (Tint Color)
The app's accent/tint color. Configured once, applied to interactive elements globally.

---

## 22 Typography Styles

All sizes in points (1pt = 1px on non-retina, 2px on @2x, 3px on @3x).

| Style | Size | Weight | Letter Spacing | Usage |
|-------|------|--------|----------------|-------|
| Large Title | 34pt | 700 | +0.37 | Navigation bar large title |
| Title 1 | 28pt | 700 | +0.36 | Primary screen title |
| Title 2 | 22pt | 700 | +0.35 | Section headers |
| Title 3 | 20pt | 600 | +0.38 | Subsection headers |
| Headline | 17pt | 600 | -0.41 | List row primary label |
| Body | 17pt | 400 | -0.41 | Default text |
| Callout | 16pt | 400 | -0.32 | Secondary descriptions |
| Subheadline | 15pt | 400 | -0.24 | Metadata, helper text |
| Footnote | 13pt | 400 | -0.08 | Legal, footer text |
| Caption 1 | 12pt | 400 | 0 | Image captions, timestamps |
| Caption 2 | 11pt | 400 | +0.07 | Smallest regular text |

SF Pro font:
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
             "SF Pro Display", "Helvetica Neue", sans-serif;
-webkit-font-smoothing: antialiased;
```

Display vs Text variant: SF Pro Display is used above 20pt (automatic in SwiftUI via `.font(.largeTitle)`).

---

## 44pt Touch Targets

Minimum interactive area is 44pt × 44pt regardless of visible element size. For small icons, extend the tap area invisibly.

```swift
// SwiftUI: extend tap area beyond visual bounds
Image(systemName: "heart")
    .frame(width: 20, height: 20)
    .contentShape(Rectangle().inset(by: -12)) // extends to 44pt
    .onTapGesture { /* ... */ }
```

```css
/* Web: use padding or pseudo-element to extend tap area */
.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  /* Extend tap area to 44px minimum */
  padding: 12px;
  margin: -12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Alternative: pseudo-element approach */
.icon-button-sm::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
}
```

---

## 6pt Border Radius

iOS standard border radius for cards, cells, and rounded elements is 6pt. Larger containers and app icons use more.

```css
:root {
  --radius-standard: 6px;   /* List cells, tags, chips */
  --radius-card: 10px;      /* Cards, sheets */
  --radius-large: 16px;     /* Large containers, bottom sheets */
  --radius-full: 9999px;    /* Pills, badges, toggles */
  --radius-app-icon: 22.5%; /* App icons (22.5% of size) */
}
```

iOS continuously interpolated corners (squircle) use `cornerRadius` + `RoundedCornerStyle.continuous` in SwiftUI.

---

## 34pt Safe Area — Bottom

iPhone models with Face ID have a 34pt home indicator area at the bottom. Content must not be obscured by it.

```swift
// SwiftUI: automatic with safeAreaInset
VStack {
  contentView
}
.safeAreaInset(edge: .bottom) {
  tabBar
}
```

```css
/* Web: use env() safe area insets for PWAs */
.bottom-bar {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* Full safe area handling */
.screen {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

For web apps targeting iOS Safari, add to `<meta>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## Animation Timing

iOS animations feel "natural" by using spring physics and short durations:

| Animation | Duration | Curve | Use Case |
|-----------|----------|-------|----------|
| Entrance | 180ms | Spring (damping 0.8) | Element entering screen |
| Exit | 120ms | Ease-in | Element leaving |
| State change | 150ms | Ease-in-out | Toggle, selection |
| Navigation push | 350ms | Spring | Screen transition |
| Navigation pop | 280ms | Ease-out | Back navigation |
| Sheet present | 400ms | Spring | Modal presentation |
| Sheet dismiss | 300ms | Ease-in | Modal dismissal |

```css
/* CSS approximations */
:root {
  --ease-ios: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --spring-ios: cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot spring */
  --ease-in-ios: cubic-bezier(0.55, 0, 1, 0.45);
}

.enter { animation: enterAnim 180ms var(--spring-ios); }
.exit  { animation: exitAnim 120ms var(--ease-in-ios); }

@keyframes enterAnim {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes exitAnim {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.94); }
}
```

---

## Opacity Pressed States

iOS uses opacity reduction (not background change) for press feedback on most controls:

```css
/* Standard press state: 0.8 opacity */
.tappable {
  transition: opacity 60ms ease;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}
.tappable:active {
  opacity: 0.8;
}

/* Highlighted list row: subtle background */
.list-row:active {
  background-color: var(--ios-fill-secondary);
}

/* Destructive action: red at full opacity */
.destructive-button:active {
  opacity: 0.7;
  color: var(--ios-red);
}
```

---

## Dynamic Type

Dynamic Type lets users set their preferred text size system-wide. Always support it.

```swift
// SwiftUI: use built-in text styles (auto-scales)
Text("Hello")
    .font(.body)          // auto-scales with Dynamic Type
    .dynamicTypeSize(.xSmall ... .xxxLarge) // limit range if needed

// UIKit: use preferred font
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true
```

```css
/* Web: use rem (user can adjust root font size) + viewport-aware clamp */
.body-text {
  font-size: clamp(0.875rem, 1rem, 1.25rem);
  line-height: 1.5;
}

/* Respect user accessibility preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

Dynamic Type size buckets: xSmall, Small, Medium (default), Large, xLarge, xxLarge, xxxLarge, AX1–AX5 (accessibility sizes).

---

## Modal Sheets

iOS uses bottom sheets for most modal UI. Full-screen modals are reserved for multi-step flows.

```swift
// SwiftUI: Sheet
.sheet(isPresented: $showSheet) {
    SheetContent()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}

// Fullscreen cover (use sparingly)
.fullScreenCover(isPresented: $showFull) {
    FullScreenContent()
}
```

Sheet design rules:
- Show a drag handle (pill indicator) at top
- Allow dismissal by dragging down
- Use `.medium` detent for short content, `.large` for forms
- Background should dim to ~50% black

---

## Tab Bars

iOS tab bars stay at bottom, always visible (unless keyboard is shown).

Rules:
- Minimum 2, maximum 5 tabs
- Each tab needs a label + icon
- Active tab uses system accent color
- Inactive tabs use `secondaryLabel` color

```swift
// SwiftUI TabView
TabView(selection: $selectedTab) {
    HomeView()
        .tabItem {
            Label("Home", systemImage: "house")
        }
        .tag(Tab.home)

    SearchView()
        .tabItem {
            Label("Search", systemImage: "magnifyingglass")
        }
        .tag(Tab.search)
}
.tint(.blue) // system accent
```

---

## See Also

- `references/macos-hig.md` — macOS design language
- `references/system-colors.md` — Full color token system, dark mode semantics
- `references/liquid-glass.md` — iOS 26+ Liquid Glass (pointer to liquid-glass-design skill)
