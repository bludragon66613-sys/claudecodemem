# Electron and Tauri — Desktop Framework Patterns

Reference for building native-feeling desktop apps: window configuration, frameless windows, drag regions, IPC patterns, platform detection, and framework trade-offs.

---

## Framework Comparison

| | Electron | Tauri v2 |
|---|---|---|
| Runtime | Node.js + Chromium bundled | System WebView + Rust |
| Bundle size | ~150–200MB | ~5–15MB |
| Memory | High (two processes + Chromium) | Low (system WebView) |
| IPC | ipcMain/ipcRenderer (Node bridge) | `invoke()` → Rust commands |
| Native APIs | Node.js + Electron APIs | Rust plugins (tauri-plugin-*) |
| Security model | Contextbridge (sandboxed) | Rust ACL (capability-based) |
| Platform | Win/Mac/Linux | Win/Mac/Linux |
| Web rendering | Chromium (consistent) | WKWebView/WebView2/WebKitGTK (varies) |
| Use when | Max API access, Node libs needed | Bundle size matters, security-first |

---

## Electron: BrowserWindow Configuration

```js
// main.js (main process)
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,

    // macOS: frameless with hidden inset for native traffic lights
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 16 },

    // Windows: custom title bar
    // titleBarStyle: "hidden",
    // titleBarOverlay: {
    //   color: "#f0f0f0",
    //   symbolColor: "#333333",
    //   height: 40,
    // },

    // macOS vibrancy — native blur behind content
    vibrancy: "under-window",          // Full window vibrancy
    // vibrancy: "sidebar",            // Sidebar-only
    // vibrancy: "under-page",         // Content area

    visualEffectState: "active",       // Keep vibrancy active even when unfocused

    // Transparency — required for custom glass effects
    transparent: true,
    backgroundColor: "#00000000",

    // No default frame
    frame: false,   // Use only if titleBarStyle not set

    // Security
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,           // Never enable in 2024+
      sandbox: true,
    },
  });

  win.loadURL("http://localhost:3000"); // dev
  // win.loadFile("dist/index.html");  // prod
}

app.whenReady().then(createWindow);
```

---

## Electron: Preload and Context Bridge

All IPC between renderer (web) and main (Node) must go through the context bridge. Never expose Node APIs directly.

```js
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Window controls
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),

  // Platform info
  platform: process.platform,

  // App info
  getVersion: () => ipcRenderer.invoke("app:version"),

  // File operations (with permission)
  openFile: () => ipcRenderer.invoke("dialog:openFile"),

  // Events from main process
  onThemeChange: (callback) => {
    ipcRenderer.on("theme:change", (_, theme) => callback(theme));
    return () => ipcRenderer.removeAllListeners("theme:change");
  },
});
```

```js
// main.js — handle IPC calls
const { ipcMain, BrowserWindow, app } = require("electron");

ipcMain.handle("window:minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.handle("window:maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.handle("window:close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle("window:isMaximized", (event) => {
  return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
});

ipcMain.handle("app:version", () => app.getVersion());
```

```ts
// renderer — TypeScript types
declare global {
  interface Window {
    electron: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      platform: "darwin" | "win32" | "linux";
      getVersion: () => Promise<string>;
      openFile: () => Promise<string | null>;
      onThemeChange: (cb: (theme: string) => void) => () => void;
    };
  }
}
```

---

## Tauri v2: Window Configuration

```json
// tauri.conf.json
{
  "app": {
    "windows": [
      {
        "title": "My App",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "decorations": false,
        "transparent": true,
        "resizable": true,
        "maximizable": true,
        "minimizable": true,
        "closable": true,
        "titleBarStyle": "Overlay",
        "hiddenTitle": true,
        "shadow": true
      }
    ]
  },
  "bundle": {
    "macOS": {
      "frameworks": [],
      "exceptionDomain": ""
    }
  }
}
```

### Tauri v2: Rust Commands (IPC)

```rust
// src-tauri/src/lib.rs
use tauri::{Manager, Window};

#[tauri::command]
async fn minimize_window(window: Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
async fn maximize_window(window: Window) -> Result<(), String> {
    if window.is_maximized().map_err(|e| e.to_string())? {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
async fn close_window(window: Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_platform() -> String {
    std::env::consts::OS.to_string()
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            minimize_window,
            maximize_window,
            close_window,
            get_platform,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Tauri v2: Frontend IPC

```ts
// Using @tauri-apps/api v2
import { invoke } from "@tauri-apps/api/core";

export const windowControls = {
  minimize: () => invoke("minimize_window"),
  maximize: () => invoke("maximize_window"),
  close: () => invoke("close_window"),
  platform: () => invoke<string>("get_platform"),
};
```

---

## CSS Drag Regions

Both Electron and Tauri use `-webkit-app-region` for CSS-based drag regions. This is the same CSS covered in `window-chrome.md`, but here's the integration context for each framework.

```css
/* Works in both Electron and Tauri */
.drag-region {
  -webkit-app-region: drag;
  user-select: none;
}

.no-drag {
  -webkit-app-region: no-drag;
}
```

**Tauri alternative:** Tauri v2 also supports explicit drag region definition in config:

```json
// tauri.conf.json — define drag region without CSS
{
  "app": {
    "windows": [{
      "titleBarStyle": "Transparent"
    }]
  }
}
```

Or via JavaScript API:

```ts
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();
// Tauri v2: use CSS -webkit-app-region or the setIgnoreCursorEvents API
await appWindow.setDecorations(false);
```

---

## Platform Detection and Conditional UI

Show traffic lights only on macOS. Show Windows-style title bar buttons on Windows.

```ts
// Detect platform
const platform = {
  isMac: window.navigator.platform.startsWith("Mac")
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document === false),
  isWindows: window.navigator.platform.startsWith("Win"),
  isLinux: window.navigator.platform.startsWith("Linux"),
};

// Or via Electron
const isMac = window.electron?.platform === "darwin";
const isWindows = window.electron?.platform === "win32";
```

```tsx
// Conditional title bar rendering
function TitleBar() {
  const isMac = window.electron?.platform === "darwin";

  return (
    <div className="title-bar">
      {isMac ? (
        // macOS: traffic lights are native; show spacer
        <div className="traffic-lights-spacer" style={{ width: 72 }} />
      ) : (
        // Windows/Linux: custom traffic lights
        <TrafficLights />
      )}
      <span className="title-bar-title">My App</span>
      {!isMac && <WindowsControls />}
    </div>
  );
}

// Windows-style minimize/maximize/close
function WindowsControls() {
  return (
    <div className="windows-controls">
      <button onClick={() => window.electron.minimize()} aria-label="Minimize">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <path d="M0 0H10" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <button onClick={() => window.electron.maximize()} aria-label="Maximize">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <rect x="0.75" y="0.75" width="8.5" height="8.5"
            stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      <button
        className="close-btn"
        onClick={() => window.electron.close()}
        aria-label="Close"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
```

```css
.windows-controls {
  display: flex;
  margin-left: auto;
  -webkit-app-region: no-drag;
}

.windows-controls button {
  width: 46px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: default;
  transition: background 100ms;
}

.windows-controls button:hover {
  background: var(--bg-hover, rgba(0,0,0,0.06));
}

.windows-controls .close-btn:hover {
  background: #e81123;
  color: white;
}
```

---

## Tauri v2 Capability System

Tauri v2 uses explicit capability declarations instead of Electron's contextBridge. Define what the app is allowed to do:

```json
// src-tauri/capabilities/default.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "window:allow-minimize",
    "window:allow-maximize",
    "window:allow-unmaximize",
    "window:allow-close",
    "window:allow-is-maximized",
    "dialog:allow-open",
    "fs:allow-read-text-file",
    "fs:allow-write-text-file"
  ]
}
```

This is more secure than Electron's approach — permissions must be explicitly granted per window.

---

## Native Vibrancy — Tauri vs Electron

| Effect | Electron | Tauri |
|--------|----------|-------|
| macOS vibrancy | `vibrancy: "under-window"` in BrowserWindow config | Via `tauri-plugin-vibrancy` (community plugin) |
| Windows Mica/Acrylic | `backgroundMaterial: "mica"` or `"acrylic"` | Via `tauri-plugin-vibrancy` |
| CSS fallback | `backdrop-filter: blur()` | `backdrop-filter: blur()` |

For Electron, native vibrancy is best-in-class — OS composites your window content into the desktop, creating true transparency. CSS `backdrop-filter` only blurs HTML content below the element, not the actual desktop behind the app window.

For Tauri, the community `tauri-plugin-vibrancy` crate adds similar support.

---

## See Also

- `references/glass-morphism.md` — CSS-based glass effects inside the window
- `references/window-chrome.md` — HTML/CSS for traffic lights, title bar, toolbar
