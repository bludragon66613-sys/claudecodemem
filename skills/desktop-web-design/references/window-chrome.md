# Window Chrome — Traffic Lights, Title Bar, Toolbar, Sidebar

Reference for building macOS-style window chrome in web apps: traffic light buttons, draggable title bars, toolbar patterns, sidebar navigation with progressive disclosure.

---

## Traffic Light Buttons

The three window control circles (close/minimize/maximize) at 12px each with 8px gap.

```html
<div class="traffic-lights" role="group" aria-label="Window controls">
  <button class="traffic-light close" aria-label="Close window" title="Close">
    <svg class="traffic-light-icon" viewBox="0 0 10 10">
      <path d="M3 3L7 7M7 3L3 7" stroke="currentColor" stroke-width="1.2"
        stroke-linecap="round"/>
    </svg>
  </button>
  <button class="traffic-light minimize" aria-label="Minimize window" title="Minimize">
    <svg class="traffic-light-icon" viewBox="0 0 10 10">
      <path d="M2 5H8" stroke="currentColor" stroke-width="1.2"
        stroke-linecap="round"/>
    </svg>
  </button>
  <button class="traffic-light maximize" aria-label="Maximize window" title="Maximize">
    <svg class="traffic-light-icon" viewBox="0 0 10 10">
      <path d="M3 2H8V7M7 3L2 8" stroke="currentColor" stroke-width="1.2"
        stroke-linecap="round"/>
    </svg>
  </button>
</div>
```

```css
.traffic-lights {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Must be no-drag — inside a draggable title bar */
  -webkit-app-region: no-drag;
}

.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: filter 80ms ease;
}

.traffic-light-icon {
  width: 8px;
  height: 8px;
  /* Icons hidden until hover */
  opacity: 0;
  transition: opacity 80ms ease;
  color: rgba(0, 0, 0, 0.45);
}

/* Reveal icons on parent group hover */
.traffic-lights:hover .traffic-light-icon {
  opacity: 1;
}

/* Colors */
.close    { background: #FF5F57; }
.minimize { background: #FEBC2E; }
.maximize { background: #28C840; }

/* Hover states */
.close:hover    { filter: brightness(0.88); }
.minimize:hover { filter: brightness(0.88); }
.maximize:hover { filter: brightness(0.88); }

/* Pressed states */
.close:active    { filter: brightness(0.76); }
.minimize:active { filter: brightness(0.76); }
.maximize:active { filter: brightness(0.76); }

/* Dark mode — slightly different palette */
[data-theme="dark"] .close    { background: #FF5F57; }
[data-theme="dark"] .minimize { background: #FEBC2E; }
[data-theme="dark"] .maximize { background: #28C840; }
```

---

## Draggable Title Bar

The `-webkit-app-region: drag` CSS property enables native window dragging in Electron and Tauri. The title bar zone should be approximately 50px tall.

```css
/* Title bar layout */
.title-bar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 12px;

  /* Background — vibrancy approximation */
  background: var(--surface-glass-primary, rgba(248, 248, 248, 0.80));
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border-bottom: 1px solid var(--separator, rgba(0, 0, 0, 0.10));

  /* CRITICAL: entire bar is draggable */
  -webkit-app-region: drag;
  user-select: none;
}

/* Title text — centered on macOS */
.title-bar-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, rgba(0, 0, 0, 0.55));
  pointer-events: none; /* Don't block drag region */
}

/* Everything interactive MUST be no-drag */
.title-bar button,
.title-bar input,
.title-bar a,
.title-bar select,
.title-bar [role="button"],
.title-bar [role="combobox"],
.traffic-lights {
  -webkit-app-region: no-drag;
}
```

### Common Pitfall

If you put a button or interactive element in the title bar and forget `-webkit-app-region: no-drag`, clicks on it will instead trigger window dragging. This is silent — the button just won't work. Always set `no-drag` on every interactive child.

---

## Toolbar Patterns

The toolbar sits below (or inside) the title bar. Contains search, segmented controls, action buttons.

```html
<div class="toolbar" role="toolbar" aria-label="Main toolbar">
  <!-- Left: back/forward navigation -->
  <div class="toolbar-group">
    <button class="toolbar-btn" aria-label="Back">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="toolbar-btn" aria-label="Forward">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>

  <!-- Center: search field -->
  <div class="toolbar-search">
    <input type="search" placeholder="Search..." aria-label="Search" />
  </div>

  <!-- Right: segmented control -->
  <div class="segmented-control" role="group" aria-label="View mode">
    <button class="segment active" aria-pressed="true">List</button>
    <button class="segment" aria-pressed="false">Grid</button>
  </div>
</div>
```

```css
.toolbar {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  border-bottom: 1px solid var(--separator);
  background: var(--bg-toolbar, var(--surface-glass-secondary));
  -webkit-app-region: drag; /* Make toolbar draggable too */
}

.toolbar > * {
  -webkit-app-region: no-drag;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: default;
  transition: background 100ms ease;
}

.toolbar-btn:hover {
  background: var(--bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--text-primary);
}

.toolbar-btn:active {
  background: var(--bg-pressed, rgba(0, 0, 0, 0.10));
}

/* Search field */
.toolbar-search {
  flex: 1;
  max-width: 300px;
  margin: 0 auto;
}

.toolbar-search input {
  width: 100%;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: var(--bg-fill, rgba(0, 0, 0, 0.06));
  padding: 0 10px 0 28px; /* Left padding for search icon */
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
}

.toolbar-search input:focus {
  background: var(--bg-content, #fff);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.30);
}

/* Segmented control */
.segmented-control {
  display: flex;
  border-radius: 7px;
  background: var(--bg-fill, rgba(0, 0, 0, 0.06));
  padding: 2px;
  gap: 1px;
}

.segment {
  height: 24px;
  padding: 0 10px;
  border-radius: 5px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: default;
  transition: background 100ms, color 100ms;
}

.segment.active {
  background: var(--bg-content, #fff);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

---

## Sidebar Navigation

Toggleable sidebar with collapsible sections and progressive disclosure.

```tsx
interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${open ? "open" : "collapsed"}`}
      aria-label="Navigation"
    >
      <nav>
        <SidebarSection title="Library" defaultOpen>
          <SidebarItem icon="house" label="Home" href="/" />
          <SidebarItem icon="star" label="Starred" href="/starred" />
          <SidebarItem icon="clock" label="Recent" href="/recent" />
        </SidebarSection>

        <SidebarSection title="Collections">
          <SidebarItem icon="folder" label="Documents" href="/docs" />
          <SidebarItem icon="photo" label="Images" href="/images" />
        </SidebarSection>
      </nav>
    </aside>
  );
}
```

```css
.sidebar {
  width: 220px;
  min-width: 160px;
  max-width: 320px;
  height: 100%;
  background: var(--surface-glass-secondary, rgba(246, 246, 246, 0.80));
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-right: 1px solid var(--separator);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

/* Collapsed state — icon-only sidebar */
.sidebar.collapsed {
  width: 52px;
}

/* Section header */
.sidebar-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary, rgba(0, 0, 0, 0.35));
  cursor: default;
  user-select: none;
}

/* Sidebar item */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 7px;
  margin: 1px 6px;
  font-size: 13px;
  color: var(--text-primary);
  text-decoration: none;
  cursor: default;
  transition: background 80ms ease;
}

.sidebar-item:hover {
  background: var(--bg-hover, rgba(0, 0, 0, 0.05));
}

.sidebar-item.active {
  background: var(--accent, #007AFF);
  color: white;
}

.sidebar-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.70;
}

.sidebar-item.active .sidebar-item-icon {
  opacity: 1;
}

/* Hide labels when collapsed */
.sidebar.collapsed .sidebar-item-label,
.sidebar.collapsed .sidebar-section-header span {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
```

---

## Resizable Panes

For two-panel layouts where the divider can be dragged:

```tsx
function ResizableLayout({ children }: { children: [React.ReactNode, React.ReactNode] }) {
  const [leftWidth, setLeftWidth] = useState(220);
  const isDragging = useRef(false);

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = leftWidth;

    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      const delta = e.clientX - startX;
      const newWidth = Math.min(400, Math.max(160, startWidth + delta));
      setLeftWidth(newWidth);
    }

    function onMouseUp() {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  return (
    <div className="resizable-layout">
      <div className="pane-left" style={{ width: leftWidth }}>
        {children[0]}
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
      />
      <div className="pane-right">{children[1]}</div>
    </div>
  );
}
```

```css
.resizable-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.pane-left {
  flex-shrink: 0;
  overflow: auto;
}

.pane-right {
  flex: 1;
  overflow: auto;
}

.resize-handle {
  width: 1px;
  background: var(--separator);
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
}

/* Wider invisible hit area */
.resize-handle::after {
  content: "";
  position: absolute;
  top: 0;
  left: -4px;
  right: -4px;
  bottom: 0;
}

.resize-handle:hover,
.resize-handle:active {
  background: var(--accent, #007AFF);
  opacity: 0.6;
}
```

---

## System Font Stack

```css
body {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    "SF Pro Display",
    "Helvetica Neue",
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 13px;
}

/* Monospace */
code, pre, kbd {
  font-family:
    "SF Mono",
    ui-monospace,
    "Cascadia Code",
    "Fira Code",
    Menlo,
    Monaco,
    monospace;
  font-size: 12px;
}
```

---

## See Also

- `references/glass-morphism.md` — Backdrop blur, layer management, semantic color vars
- `references/electron-tauri.md` — Native window config for drag regions and frameless windows
