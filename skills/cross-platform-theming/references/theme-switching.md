# Theme Switching — FOUC Prevention, Persistence, System Preference

Reference for implementing reliable theme switching without flash, with localStorage persistence and system preference fallback.

---

## The FOUC Problem

Flash of Unstyled Content happens when JavaScript runs after the browser has already rendered the default theme. The page shows light mode briefly before switching to dark. The fix: run theme detection synchronously in `<head>` before any rendering.

---

## Early-Execution Anti-FOUC Script

Place this inline script as the **first child of `<head>`**, before any stylesheets or framework code:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- CRITICAL: Must be first, before stylesheets -->
  <script>
    (function () {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = stored ?? (prefersDark ? "dark" : "light");

      // DaisyUI: set data-theme on html element
      document.documentElement.setAttribute("data-theme", theme);

      // Tailwind dark mode: add 'dark' class on html element
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    })();
  </script>
  <link rel="stylesheet" href="/styles.css" />
</head>
```

This IIFE runs synchronously before the DOM is painted. The browser applies CSS variables from `data-theme` before any pixels are drawn.

---

## localStorage Persistence Pattern

```ts
const THEME_KEY = "theme";
type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme | null {
  try {
    return localStorage.getItem(THEME_KEY) as Theme | null;
  } catch {
    // localStorage blocked (private browsing, permissions)
    return null;
  }
}

function setTheme(theme: Theme): void {
  const resolved = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  // Persist user choice
  if (theme === "system") {
    localStorage.removeItem(THEME_KEY); // let system preference take over
  } else {
    localStorage.setItem(THEME_KEY, theme);
  }

  // Apply to DOM
  document.documentElement.setAttribute("data-theme", resolved);

  // Tailwind class-based dark mode
  document.documentElement.classList.toggle("dark", resolved === "dark");

  // Sync browser chrome color
  syncThemeColor(resolved);
}
```

---

## `prefers-color-scheme` Fallback

Always respect system preference when no stored preference exists:

```ts
function resolveInitialTheme(): "light" | "dark" {
  const stored = getStoredTheme();
  if (stored && stored !== "system") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// React to OS theme changes in real-time (only when user has "system" preference)
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function handleSystemThemeChange(e: MediaQueryListEvent): void {
  const stored = getStoredTheme();
  if (!stored || stored === "system") {
    // User hasn't overridden — follow OS
    setTheme(e.matches ? "dark" : "light");
  }
}

mediaQuery.addEventListener("change", handleSystemThemeChange);

// Cleanup
function destroy(): void {
  mediaQuery.removeEventListener("change", handleSystemThemeChange);
}
```

---

## `theme-color` Meta Tag

The `theme-color` meta tag controls browser chrome color (tab bar, address bar on mobile, PWA title bar). Sync it with theme changes for a cohesive native feel.

```html
<!-- In <head> — initial value matches default theme -->
<meta name="theme-color" content="#ffffff" id="theme-color-meta" />
```

```ts
const THEME_COLORS: Record<"light" | "dark", string> = {
  light: "#ffffff",
  dark: "#09090b", // shadcn dark background
};

function syncThemeColor(theme: "light" | "dark"): void {
  const meta = document.getElementById("theme-color-meta") as HTMLMetaElement | null;
  if (meta) {
    meta.content = THEME_COLORS[theme];
  }
}
```

For PWAs, also update the manifest dynamically or provide multiple theme colors in the manifest:

```json
{
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

---

## Class-Based Dark Mode (Tailwind)

Tailwind's `dark:` variant requires `darkMode: 'class'` in config, which checks for a `dark` class on `<html>`.

### Tailwind v3 config

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  // ...
};
```

### Tailwind v4 config

```css
/* In CSS config or globals.css */
@variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

This makes `dark:` apply whenever an ancestor has `data-theme="dark"` — works with DaisyUI's approach without needing a separate class.

### Toggle function

```ts
function toggleTheme(): void {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
}
```

---

## SSR / SSG Considerations

Server-rendered pages don't have access to `localStorage` or `matchMedia`. Strategies:

### Option 1: Inline Script (Recommended)

Include the anti-FOUC script inline in the server-rendered HTML `<head>`. It runs before hydration and sets the theme before the first paint.

```tsx
// Next.js: app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', t || (d ? 'dark' : 'light'));
                if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` prevents React from warning about the mismatch between server-rendered attribute (`data-theme="light"`) and client-applied value (`data-theme="dark"`).

### Option 2: Cookie-Based (No Flash, No Script)

Read a cookie server-side and render the correct `data-theme` attribute from the start:

```ts
// Next.js server component
import { cookies } from "next/headers";

export default function RootLayout({ children }) {
  const theme = cookies().get("theme")?.value ?? "light";
  return <html data-theme={theme}>{children}</html>;
}
```

```ts
// Client: set cookie when theme changes
function setThemeCookie(theme: string): void {
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}
```

Cookie approach eliminates the script entirely but requires a server round-trip to update.

---

## Smooth Theme Transitions

Avoid jarring instant switches with a CSS transition on theme-sensitive properties:

```css
/* Apply transition only when switching, not on initial load */
.theme-transition,
.theme-transition *,
.theme-transition *::before,
.theme-transition *::after {
  transition:
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease !important;
}
```

```ts
function setThemeWithTransition(theme: "light" | "dark"): void {
  document.documentElement.classList.add("theme-transition");
  setTheme(theme);

  // Remove transition class after switch completes
  const cleanup = () => {
    document.documentElement.classList.remove("theme-transition");
  };
  window.setTimeout(cleanup, 250);
}
```

Do NOT add this transition globally at all times — it will make every background-color change feel sluggish (e.g., hover states, focus rings).

---

## React Hook

```tsx
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });

  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  function applyTheme(newTheme: Theme): void {
    setThemeState(newTheme);
    const resolved =
      newTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : newTheme;

    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");

    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
  }

  // React to OS changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, resolvedTheme, setTheme: applyTheme };
}
```

---

## See Also

- `references/scoped-themes.md` — DaisyUI data-theme, nested themes, 35 built-in themes
- `references/framework-agnostic.md` — Using these patterns across React, Vue, Svelte
