# WAI-ARIA Patterns Reference

Per-widget ARIA role mapping, required attributes, keyboard interactions, and screen reader patterns. Synthesized from WAI-ARIA Authoring Practices 1.2 and Radix UI implementation.

---

## ARIA Role Mapping — Quick Lookup

| Widget | Role | Notes |
|--------|------|-------|
| Dialog | `dialog` | Modal: `aria-modal="true"` |
| Alert Dialog | `alertdialog` | For destructive confirmations |
| Dropdown Menu | `menu` + items: `menuitem` | |
| Context Menu | `menu` | Triggered by right-click |
| Menubar | `menubar` > `menuitem` | Top-level nav menus |
| Navigation Menu | `navigation` (landmark) | Use `<nav>` element |
| Tabs | `tablist` > `tab` + `tabpanel` | |
| Accordion | `region` per panel | Each trigger: `button` |
| Select | `combobox` + `listbox` + `option` | Native `<select>` for simple cases |
| Combobox | `combobox` + `listbox` | Autocomplete/search |
| Popover | `dialog` or none | Depends on content type |
| Tooltip | `tooltip` | Trigger: `aria-describedby` |
| Hover Card | `dialog` (if interactive) | Non-interactive: no role needed |
| Slider | `slider` | |
| Switch | `switch` | Alternative to checkbox |
| Checkbox | `checkbox` | Or native `<input type="checkbox">` |
| Radio Group | `radiogroup` > `radio` | |
| Toggle | `button` + `aria-pressed` | |
| Toggle Group | `group` > `button[aria-pressed]` | |
| Toast / Alert | `status` or `alert` | `alert` for urgent messages |
| Scroll Area | No role required | Scrollable container |

---

## Dialog

```tsx
// Required attributes
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"   // points to visible title
  aria-describedby="dialog-desc"   // optional: points to description
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
</div>
```

**Keyboard interactions:**
- `Tab` / `Shift+Tab` — cycle through focusable elements within dialog
- `Escape` — close dialog, return focus to trigger
- `Enter` — activate focused button

**Focus behavior:**
- On open: focus first focusable element (or dialog container if none)
- On close: return focus to element that triggered open
- Background: `aria-hidden="true"` on all non-dialog content

---

## Menu (Dropdown / Context)

```tsx
<button
  aria-haspopup="menu"
  aria-expanded={open}
  aria-controls="menu-id"
>
  Actions
</button>
<ul
  id="menu-id"
  role="menu"
  aria-label="Actions"
  aria-orientation="vertical"
>
  <li role="menuitem" tabIndex={-1}>Edit</li>
  <li role="menuitem" tabIndex={-1}>Duplicate</li>
  <li role="separator" />
  <li role="menuitemcheckbox" aria-checked={checked} tabIndex={-1}>
    Show Details
  </li>
  <li role="menuitemradio" aria-checked={selected === 'a'} tabIndex={-1}>
    Option A
  </li>
</ul>
```

**Keyboard interactions:**
- `Enter` / `Space` — open menu from trigger, activate focused item
- `Escape` — close, return focus to trigger
- `ArrowDown` — move to next item (wraps)
- `ArrowUp` — move to previous item (wraps)
- `Home` — first item
- `End` — last item
- `Tab` — close menu (focus moves to next document element)
- Any printable character — move focus to first matching item

---

## Tabs

```tsx
<div>
  <div role="tablist" aria-label="Account settings" aria-orientation="horizontal">
    <button
      role="tab"
      id="tab-profile"
      aria-controls="panel-profile"
      aria-selected={active === 'profile'}
      tabIndex={active === 'profile' ? 0 : -1}
    >
      Profile
    </button>
    <button
      role="tab"
      id="tab-billing"
      aria-controls="panel-billing"
      aria-selected={active === 'billing'}
      tabIndex={active === 'billing' ? 0 : -1}
    >
      Billing
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel-profile"
    aria-labelledby="tab-profile"
    tabIndex={0}   // makes panel focusable for keyboard users
    hidden={active !== 'profile'}
  >
    Profile content
  </div>
</div>
```

**Keyboard interactions (automatic activation):**
- `ArrowRight` / `ArrowLeft` — move focus AND activate next/previous tab
- `Home` — first tab
- `End` — last tab
- `Tab` — move focus into active panel

**Manual activation variant:** Arrow keys only move focus; `Enter`/`Space` activates.

---

## Accordion

```tsx
<div>
  {items.map((item) => (
    <div key={item.id}>
      <h3>
        <button
          aria-expanded={expanded === item.id}
          aria-controls={`panel-${item.id}`}
          id={`trigger-${item.id}`}
        >
          {item.title}
        </button>
      </h3>
      <div
        role="region"
        id={`panel-${item.id}`}
        aria-labelledby={`trigger-${item.id}`}
        hidden={expanded !== item.id}
      >
        {item.content}
      </div>
    </div>
  ))}
</div>
```

**Keyboard interactions:**
- `Enter` / `Space` — toggle expanded state
- `Tab` — move to next focusable element
- `ArrowDown` — move focus to next accordion trigger
- `ArrowUp` — move focus to previous trigger
- `Home` / `End` — first/last trigger

Note: `role="region"` requires an accessible name (`aria-labelledby`). Omit `role="region"` if there are more than 6 accordions on a page (landmark spam).

---

## Combobox / Select

```tsx
// Combobox (searchable select)
<div>
  <label id="combo-label" htmlFor="combo-input">Country</label>
  <input
    id="combo-input"
    type="text"
    role="combobox"
    aria-expanded={open}
    aria-autocomplete="list"
    aria-controls="combo-list"
    aria-activedescendant={focusedOption ? `option-${focusedOption}` : undefined}
  />
  <ul
    id="combo-list"
    role="listbox"
    aria-labelledby="combo-label"
    hidden={!open}
  >
    {options.map((opt) => (
      <li
        key={opt.value}
        id={`option-${opt.value}`}
        role="option"
        aria-selected={selected === opt.value}
      >
        {opt.label}
      </li>
    ))}
  </ul>
</div>
```

**Keyboard interactions:**
- `ArrowDown` — open list, move to next option
- `ArrowUp` — move to previous option
- `Enter` — select focused option, close list
- `Escape` — close list without selection
- `Alt+ArrowDown` — open without moving to first option
- `Alt+ArrowUp` — close and return focus to input

---

## Slider

```tsx
<div
  role="slider"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={value}
  aria-valuetext={`${value} percent`}   // human-readable when number is ambiguous
  aria-label="Volume"
  tabIndex={0}
>
  <div style={{ width: `${value}%` }} />
</div>
```

**Keyboard interactions:**
- `ArrowRight` / `ArrowUp` — increase by step
- `ArrowLeft` / `ArrowDown` — decrease by step
- `Page Up` — increase by large step (10x)
- `Page Down` — decrease by large step
- `Home` — minimum value
- `End` — maximum value

---

## Switch / Toggle

```tsx
// Switch — use for on/off settings
<button
  role="switch"
  aria-checked={enabled}
  aria-label="Enable notifications"
>
  <span className="thumb" />
</button>

// Toggle button — use for active/inactive state
<button
  aria-pressed={bold}
  aria-label="Bold"
  onClick={() => setBold(!bold)}
>
  <BoldIcon />
</button>
```

---

## Tooltip

```tsx
<>
  <button
    aria-describedby="tooltip-id"
    onMouseEnter={show}
    onFocus={show}
    onMouseLeave={hide}
    onBlur={hide}
  >
    Save
  </button>
  {visible && (
    <div
      id="tooltip-id"
      role="tooltip"
    >
      Ctrl+S
    </div>
  )}
</>
```

Key rules:
- Trigger must be focusable
- `aria-describedby` (not `aria-labelledby`) — supplements, does not replace accessible name
- Tooltip MUST dismiss on `Escape`
- Tooltip MUST NOT contain interactive elements (use popover instead)
- Tooltip appears on hover AND focus — keyboard users must not be excluded

---

## Alert / Toast Patterns

```tsx
// Status region — polite, non-interrupting (e.g., save confirmation)
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// Alert region — assertive, interrupting (e.g., error, required action)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>

// Log region — sequential messages (e.g., activity feed)
<div role="log" aria-live="polite" aria-relevant="additions">
  {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
</div>
```

**Rules for live regions:**
- `aria-atomic="true"`: announce entire region when any part changes
- `aria-relevant`: `additions` (new nodes), `removals`, `text` (text changes), `all`
- Add live region to DOM BEFORE injecting content — screen readers observe mutation
- Avoid `assertive` except for genuine errors; it interrupts current announcements

---

## State Machine Accessibility (Zag.js)

Zag.js bakes ARIA attributes directly into FSM state transitions — you cannot have the wrong ARIA state because accessibility IS the state machine:

```ts
import { machine, connect } from '@zag-js/dialog'
import { useMachine } from '@zag-js/react'

const [state, send] = useMachine(machine({ id: 'dialog-1' }))
const api = connect(state, send)

// api automatically provides correct ARIA for current state:
// api.triggerProps → { aria-haspopup, aria-expanded, aria-controls, onClick, ... }
// api.contentProps → { role, aria-modal, aria-labelledby, hidden, ... }
// api.titleProps   → { id: 'dialog-1:title' }
// api.closeTriggerProps → { aria-label: 'Close', onClick, ... }

return (
  <div>
    <button {...api.triggerProps}>Open Dialog</button>
    {api.isOpen && (
      <div {...api.contentProps}>
        <h2 {...api.titleProps}>Title</h2>
        <button {...api.closeTriggerProps}>Close</button>
      </div>
    )}
  </div>
)
```

The FSM guarantees: `open` state → content has `aria-modal="true"` + focus trapped. `closed` state → content is `hidden` + focus returns to trigger. No manual attribute management.

---

## Screen Reader Announcement Patterns

```tsx
// Visually hidden text (accessible, not visible)
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

// Icon buttons MUST have accessible names
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// Images: meaningful → alt text, decorative → alt=""
<img src="chart.png" alt="Revenue grew 40% in Q3" />
<img src="divider.png" alt="" role="presentation" />

// Groups need labels
<div role="group" aria-labelledby="shipping-heading">
  <h3 id="shipping-heading">Shipping Address</h3>
  <input ... />
</div>
```

**Key SR announcement rules:**
- `aria-label` overrides visible text — keep them in sync
- `aria-labelledby` references visible element by id — preferred over `aria-label`
- `aria-hidden="true"` removes from accessibility tree (icons, decorative images)
- Never use `tabIndex > 0` — it creates unexpected tab order
- Required fields: use `aria-required="true"` AND visual indicator
- Error messages: `aria-invalid="true"` on input + `aria-describedby` pointing to error
