# macOS HIG — Design Language Reference

Full macOS Human Interface Guidelines implementation reference: typography, grid system, corner radii, dark mode, vibrancy, shadows, window chrome, keyboard patterns.

---

## SF Pro Typography

macOS uses SF Pro for all system text. The base body size is 13px, not 16px (unlike web conventions).

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Large Title | 26px | 700 | Hero labels, onboarding |
| Title 1 | 22px | 700 | Window/panel titles |
| Title 2 | 17px | 700 | Section headers |
| Title 3 | 15px | 600 | Subsection headers |
| Headline | 13px | 600 | List headers, emphasized labels |
| Body | 13px | 400 | Default text |
| Callout | 12px | 400 | Secondary information |
| Subheadline | 11px | 400 | Helper text, captions |
| Footnote | 10px | 400 | Legal, metadata |
| Caption 1 | 10px | 400 | Image captions |
| Caption 2 | 10px | 500 | Small labels needing emphasis |

Letter spacing is tighter than web defaults. SF Pro uses optical kerning at display sizes.

```css
/* macOS-faithful web typography */
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: 13px;
  line-height: 1.5;
  font-feature-settings: "kern" 1;
  -webkit-font-smoothing: antialiased;
}

.title-1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
.title-2 { font-size: 17px; font-weight: 700; letter-spacing: -0.2px; }
.title-3 { font-size: 15px; font-weight: 600; }
.headline { font-size: 13px; font-weight: 600; }
.body    { font-size: 13px; font-weight: 400; }
.callout { font-size: 12px; font-weight: 400; }
.subheadline { font-size: 11px; font-weight: 400; }
.footnote { font-size: 10px; font-weight: 400; color: var(--text-secondary); }
```

---

## 8px Grid System

All spacing and sizing is derived from an 8px base unit. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48.

```css
:root {
  --space-1: 4px;   /* half unit — tight internal padding */
  --space-2: 8px;   /* 1 unit — standard gap */
  --space-3: 12px;  /* 1.5 units — medium spacing */
  --space-4: 16px;  /* 2 units — standard padding */
  --space-5: 20px;  /* 2.5 units */
  --space-6: 24px;  /* 3 units — section spacing */
  --space-8: 32px;  /* 4 units — large spacing */
  --space-10: 40px; /* 5 units */
  --space-12: 48px; /* 6 units — major sections */
}
```

Common macOS measurements:
- Sidebar width: 200–240px
- Toolbar height: 38–52px (depends on compact/regular)
- Row height: 28–32px (standard list rows)
- Icon size: 16px, 32px, 64px, 128px, 256px, 512px

---

## Graduated Corner Radii

macOS uses different radii at different scales. Larger containers use larger radii; smaller controls use tighter radii. This creates visual harmony across scales.

```css
:root {
  --radius-window: 10px;  /* Full windows, panels, sheets */
  --radius-card: 8px;     /* Cards, containers within windows */
  --radius-button: 6px;   /* Buttons, input fields */
  --radius-input: 4px;    /* Small inputs, tags, badges */
  --radius-xs: 2px;       /* Tiny elements, checkmarks */
}

/* Usage */
.window    { border-radius: var(--radius-window); }
.card      { border-radius: var(--radius-card); }
.btn       { border-radius: var(--radius-button); }
.input     { border-radius: var(--radius-input); }
.badge     { border-radius: var(--radius-input); }
```

SwiftUI equivalents: `.cornerRadius(10)`, `.clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))`. Use `.continuous` curve style (squircle) rather than the default circular arc.

---

## Independent Dark Mode

macOS dark mode is not a simple color inversion. Each semantic color has a carefully chosen dark variant. Backgrounds become slightly lighter (layering) rather than pure black.

```css
:root,
[data-theme="light"] {
  /* Window backgrounds — layered from back to front */
  --bg-window: #ececec;
  --bg-sidebar: #e5e5e5;
  --bg-content: #ffffff;
  --bg-card: #f5f5f7;
  --bg-elevated: #ffffff;
  --bg-hover: rgba(0, 0, 0, 0.04);
  --bg-pressed: rgba(0, 0, 0, 0.08);

  /* Text */
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.55);
  --text-tertiary: rgba(0, 0, 0, 0.35);
  --text-placeholder: rgba(0, 0, 0, 0.25);
  --text-disabled: rgba(0, 0, 0, 0.25);

  /* Borders and separators */
  --border-primary: rgba(0, 0, 0, 0.12);
  --border-secondary: rgba(0, 0, 0, 0.06);
  --separator: rgba(0, 0, 0, 0.10);

  /* Accent (system blue by default) */
  --accent: #007aff;
  --accent-hover: #0069db;
  --accent-text: #ffffff;
}

[data-theme="dark"] {
  /* Dark mode uses elevated grays, NOT pure black */
  --bg-window: #1e1e1e;
  --bg-sidebar: #242424;
  --bg-content: #282828;
  --bg-card: #323232;
  --bg-elevated: #3a3a3a;
  --bg-hover: rgba(255, 255, 255, 0.05);
  --bg-pressed: rgba(255, 255, 255, 0.10);

  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-tertiary: rgba(255, 255, 255, 0.35);
  --text-placeholder: rgba(255, 255, 255, 0.25);
  --text-disabled: rgba(255, 255, 255, 0.25);

  --border-primary: rgba(255, 255, 255, 0.10);
  --border-secondary: rgba(255, 255, 255, 0.05);
  --separator: rgba(255, 255, 255, 0.08);

  --accent: #0a84ff; /* Slightly brighter in dark mode */
  --accent-hover: #339dff;
  --accent-text: #ffffff;
}
```

---

## Vibrancy and Backdrop Blur

macOS vibrancy allows the window content to interact visually with what's behind it. In web/Electron apps, approximate with `backdrop-filter`.

```css
/* Sidebar vibrancy */
.sidebar {
  background-color: rgba(248, 248, 248, 0.80);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Toolbar vibrancy */
.toolbar {
  background-color: rgba(246, 246, 246, 0.72);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

/* Panel/popover vibrancy */
.popover {
  background-color: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
}

/* Dark mode vibrancy */
[data-theme="dark"] .sidebar {
  background-color: rgba(30, 30, 30, 0.80);
  backdrop-filter: blur(20px) saturate(160%);
}

[data-theme="dark"] .toolbar {
  background-color: rgba(36, 36, 36, 0.72);
}
```

Performance note: `backdrop-filter` forces GPU compositing. Limit to key surfaces (sidebar, toolbar, overlays). Don't apply to every card.

---

## Micro-Shadows

macOS uses very subtle shadows — primarily to define edges rather than create depth. The signature is a thin 0.5px border-like shadow.

```css
/* Edge definition — the macOS signature */
.card {
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08);
}

/* Slight elevation */
.card-elevated {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 8px rgba(0, 0, 0, 0.04);
}

/* Popover / dropdown */
.popover {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Window shadow (Electron/Tauri only — OS handles native) */
.window {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.18),
    0 32px 64px rgba(0, 0, 0, 0.12);
}

[data-theme="dark"] .card {
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.06);
}
```

---

## Draggable Title Bar

The title bar zone (~50px from top) must be draggable in desktop apps. In Electron/Tauri, this is done via CSS.

```css
/* App shell structure */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title-bar {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  /* Make the entire title bar draggable */
  -webkit-app-region: drag;
  user-select: none;
}

/* Buttons inside title bar MUST be no-drag */
.title-bar button,
.title-bar input,
.title-bar a,
.title-bar [role="button"] {
  -webkit-app-region: no-drag;
}

/* Traffic light placeholder (macOS) */
.traffic-lights-spacer {
  width: 72px; /* Space for red/yellow/green circles */
  flex-shrink: 0;
}
```

---

## Keyboard-First Design

macOS users expect full keyboard access. Every action must have a discoverable keyboard shortcut.

```tsx
// Show keyboard shortcut hint in tooltip/menu
interface MenuItemProps {
  label: string;
  shortcut?: string; // e.g., "⌘N", "⌘⇧P"
  onClick: () => void;
}

function MenuItem({ label, shortcut, onClick }: MenuItemProps) {
  return (
    <button
      className="menu-item"
      onClick={onClick}
      role="menuitem"
    >
      <span className="menu-item-label">{label}</span>
      {shortcut && (
        <kbd className="menu-item-shortcut">{shortcut}</kbd>
      )}
    </button>
  );
}
```

```css
kbd.menu-item-shortcut {
  font-family: -apple-system, sans-serif;
  font-size: 11px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  padding: 0;
  margin-left: auto;
}
```

Common macOS shortcut symbols:
- `⌘` Command
- `⇧` Shift
- `⌥` Option/Alt
- `⌃` Control
- `↩` Return
- `⌫` Delete

---

## Progressive Disclosure

Show only what users need at each step. Use disclosure triangles, collapsible sections, and detail panels.

```tsx
function DisclosureSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="disclosure-section">
      <button
        className="disclosure-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <svg
          className={`disclosure-arrow ${open ? "open" : ""}`}
          width="10" height="10" viewBox="0 0 10 10"
        >
          <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{title}</span>
      </button>
      {open && <div className="disclosure-content">{children}</div>}
    </div>
  );
}
```

```css
.disclosure-arrow {
  transition: transform 150ms ease;
  color: var(--text-secondary);
}
.disclosure-arrow.open {
  transform: rotate(90deg);
}
.disclosure-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 0;
  cursor: default;
}
```

---

## Sidebar and Toolbar Patterns

```css
/* Two-column layout: sidebar + content */
.app-layout {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 220px;
  min-width: 160px;
  max-width: 320px;
  border-right: 1px solid var(--separator);
  background: var(--bg-sidebar);
  flex-shrink: 0;
  overflow-y: auto;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-content);
}

/* Sidebar nav item */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--radius-button);
  font-size: 13px;
  cursor: default;
  user-select: none;
  color: var(--text-primary);
}

.sidebar-item:hover {
  background: var(--bg-hover);
}

.sidebar-item.active {
  background: var(--accent);
  color: white;
}

.sidebar-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.75;
}
.sidebar-item.active .sidebar-item-icon {
  opacity: 1;
}
```

---

## See Also

- `references/ios-hig.md` — iOS design language
- `references/system-colors.md` — Semantic color tokens, dark mode, accent colors
- `references/liquid-glass.md` — iOS 26+ Liquid Glass integration points
