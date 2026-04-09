# Flowbite Data-Attribute API Reference

Data-attribute initialization, programmatic API, callback options, and framework integration patterns. Synthesized from Flowbite source and documentation.

---

## Core Philosophy

Flowbite components are framework-agnostic vanilla JS widgets with two parallel APIs:

1. **Declarative HTML API** — `data-*` attributes initialize components automatically on DOMContentLoaded
2. **Programmatic JS API** — imperative control via class instances (`new Modal(...)`)

Both APIs drive the same underlying behavior. Choose based on your framework context.

---

## Data-Attribute Initialization

### Modal

```html
<!-- Trigger button -->
<button
  data-modal-target="my-modal"
  data-modal-toggle="my-modal"
  type="button"
>
  Open Modal
</button>

<!-- Modal element -->
<div
  id="my-modal"
  tabindex="-1"
  aria-hidden="true"
  class="fixed left-0 right-0 top-0 z-50 hidden h-full w-full overflow-y-auto overflow-x-hidden"
>
  <div class="relative max-h-full w-full max-w-2xl p-4">
    <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
      <div class="flex items-center justify-between rounded-t border-b p-4">
        <h3 class="text-xl font-semibold">Modal Title</h3>
        <!-- Close trigger — targets modal by id -->
        <button data-modal-hide="my-modal" type="button">
          <svg><!-- X icon --></svg>
        </button>
      </div>
      <div class="p-4">Modal body content</div>
    </div>
  </div>
</div>
```

**Modal data attributes:**
| Attribute | On Element | Effect |
|-----------|-----------|--------|
| `data-modal-target="id"` | trigger | specifies which modal to control |
| `data-modal-toggle="id"` | trigger | toggles modal open/closed |
| `data-modal-show="id"` | trigger | only opens modal |
| `data-modal-hide="id"` | any inside modal | closes modal |

### Accordion

```html
<div id="accordion-collapse" data-accordion="collapse">
  <h2 id="heading-1">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-t-xl border border-b-0 p-5 font-medium"
      data-accordion-target="#body-1"
      aria-expanded="true"
      aria-controls="body-1"
    >
      <span>Section 1</span>
      <svg data-accordion-icon><!-- chevron --></svg>
    </button>
  </h2>
  <div id="body-1" aria-labelledby="heading-1">
    <div class="border border-b-0 p-5">Content 1</div>
  </div>

  <h2 id="heading-2">
    <button
      type="button"
      data-accordion-target="#body-2"
      aria-expanded="false"
      aria-controls="body-2"
    >
      Section 2
    </button>
  </h2>
  <div id="body-2" class="hidden" aria-labelledby="heading-2">
    <div class="border p-5">Content 2</div>
  </div>
</div>
```

`data-accordion` values: `"open"` (any panel can be open), `"collapse"` (only one open at a time)

### Dropdown

```html
<button
  id="dropdown-trigger"
  data-dropdown-toggle="dropdown-menu"
  data-dropdown-placement="bottom"
  type="button"
>
  Options
</button>

<div id="dropdown-menu" class="z-10 hidden w-44 divide-y rounded-lg bg-white shadow">
  <ul aria-labelledby="dropdown-trigger">
    <li><a href="#">Profile</a></li>
    <li><a href="#">Settings</a></li>
    <li><a href="#">Sign out</a></li>
  </ul>
</div>
```

**Dropdown placement options:** `top`, `top-start`, `top-end`, `bottom` (default), `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`

### Tooltip

```html
<button data-tooltip-target="tooltip-id" data-tooltip-placement="top">
  Hover me
</button>
<div id="tooltip-id" role="tooltip" class="absolute z-10 invisible inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-sm">
  Tooltip text
  <div class="tooltip-arrow" data-popper-arrow></div>
</div>
```

### Tabs

```html
<div class="border-b border-gray-200">
  <ul class="-mb-px flex flex-wrap text-center text-sm font-medium" data-tabs-toggle="#tab-content">
    <li>
      <button data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Profile</button>
    </li>
    <li>
      <button data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
    </li>
  </ul>
</div>
<div id="tab-content">
  <div id="profile" role="tabpanel" aria-labelledby="profile-tab">Profile content</div>
  <div id="dashboard" class="hidden" role="tabpanel" aria-labelledby="dashboard-tab">Dashboard content</div>
</div>
```

---

## `initFlowbite()` — SPA / SSR Integration

In SPAs, `DOMContentLoaded` only fires once. Call `initFlowbite()` after route changes to reinitialize components on new DOM:

```ts
import { initFlowbite } from 'flowbite'

// React
useEffect(() => {
  initFlowbite()
}, [pathname])  // reinit on route change

// Vue
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(() => route.path, () => {
  nextTick(() => initFlowbite())
})

// Svelte
import { afterNavigate } from '$app/navigation'
afterNavigate(() => initFlowbite())

// Next.js app router — needs 'use client'
'use client'
useEffect(() => {
  initFlowbite()
}, [])
```

`initFlowbite()` scans the DOM for data attributes and instantiates any uninitialized component instances.

---

## Programmatic API

All Flowbite interactive components expose a class-based programmatic API. Use this when you need imperative control, callbacks, or custom initialization options.

### Modal

```ts
import { Modal, type ModalOptions, type ModalInterface } from 'flowbite'

const $modalEl = document.querySelector('#my-modal') as HTMLElement

const options: ModalOptions = {
  placement: 'bottom-right',   // 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  backdrop: 'dynamic',          // 'dynamic' (click outside closes) | 'static' (click outside ignored) | 'popup'
  backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
  closable: true,               // whether Escape closes the modal
  onHide: () => console.log('modal hidden'),
  onShow: () => console.log('modal shown'),
  onToggle: () => console.log('modal toggled'),
}

const modal: ModalInterface = new Modal($modalEl, options)

modal.show()
modal.hide()
modal.toggle()
modal.isHidden()     // → boolean
modal.isVisible()    // → boolean
modal.destroy()      // remove event listeners + cleanup
```

### Dropdown

```ts
import { Dropdown, type DropdownOptions } from 'flowbite'

const $trigger = document.querySelector('#dropdown-trigger')
const $menu = document.querySelector('#dropdown-menu')

const options: DropdownOptions = {
  placement: 'bottom',
  triggerType: 'click',        // 'click' | 'hover' | 'none'
  offsetSkidding: 0,           // horizontal offset in px
  offsetDistance: 10,          // vertical offset in px
  delay: 300,                  // hover delay in ms
  ignoreClickOutsideClass: 'ignore-outside',  // class that prevents outside-click dismiss
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
}

const dropdown = new Dropdown($menu, $trigger, options)

dropdown.show()
dropdown.hide()
dropdown.toggle()
```

### Accordion

```ts
import { Accordion, type AccordionOptions, type AccordionItem } from 'flowbite'

const accordionEl = document.querySelector('#accordion-collapse')

const items: AccordionItem[] = [
  {
    id: 'accordion-collapse-heading-1',
    triggerEl: document.querySelector('#accordion-collapse-heading-1'),
    targetEl: document.querySelector('#accordion-collapse-body-1'),
    icon: document.querySelector('#icon-1'),
    active: true,              // open by default
  },
  {
    id: 'accordion-collapse-heading-2',
    triggerEl: document.querySelector('#accordion-collapse-heading-2'),
    targetEl: document.querySelector('#accordion-collapse-body-2'),
    icon: document.querySelector('#icon-2'),
    active: false,
  },
]

const options: AccordionOptions = {
  alwaysOpen: false,           // true = multiple panels open simultaneously
  activeClasses: 'bg-gray-100 dark:bg-gray-800 text-gray-900',
  inactiveClasses: 'text-gray-500',
  onOpen: (item) => console.log('opened', item),
  onClose: (item) => console.log('closed', item),
  onToggle: (item) => console.log('toggled', item),
}

const accordion = new Accordion(accordionEl, items, options)
accordion.open('accordion-collapse-heading-1')
accordion.close('accordion-collapse-heading-2')
accordion.toggle('accordion-collapse-heading-1')
```

### Tooltip

```ts
import { Tooltip, type TooltipOptions } from 'flowbite'

const $targetEl = document.querySelector('#tooltip-id')
const $triggerEl = document.querySelector('[data-tooltip-target]')

const options: TooltipOptions = {
  placement: 'top',
  triggerType: 'hover',        // 'hover' | 'click' | 'none'
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
}

const tooltip = new Tooltip($targetEl, $triggerEl, options)
tooltip.show()
tooltip.hide()
tooltip.toggle()
```

---

## Dark Mode

Flowbite uses class-based dark mode (not `prefers-color-scheme`). Toggle the `dark` class on `<html>`:

```ts
// Toggling dark mode
document.documentElement.classList.toggle('dark')

// Persist preference
const isDark = localStorage.getItem('color-theme') === 'dark'
  || (!localStorage.getItem('color-theme')
      && window.matchMedia('(prefers-color-scheme: dark)').matches)

if (isDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// On toggle button click:
function toggleTheme() {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('color-theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('color-theme', 'dark')
  }
}
```

Tailwind config must have `darkMode: 'class'` set.

---

## Framework Integration Patterns

### React — Component Wrapper

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { Modal } from 'flowbite'

interface FlowbiteModalProps {
  id: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function FlowbiteModal({ id, isOpen, onClose, children }: FlowbiteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<InstanceType<typeof Modal> | null>(null)

  useEffect(() => {
    if (!modalRef.current) return

    instanceRef.current = new Modal(modalRef.current, {
      backdrop: 'static',
      onHide: onClose,
    })

    return () => instanceRef.current?.destroy()
  }, [onClose])

  useEffect(() => {
    if (isOpen) instanceRef.current?.show()
    else instanceRef.current?.hide()
  }, [isOpen])

  return (
    <div ref={modalRef} id={id} tabIndex={-1} aria-hidden={!isOpen} className="fixed hidden">
      {children}
    </div>
  )
}
```

### Vue — Composition API

```ts
// composables/useFlowbiteModal.ts
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Modal } from 'flowbite'

export function useFlowbiteModal(elementId: string) {
  const modal = ref<InstanceType<typeof Modal> | null>(null)

  onMounted(() => {
    const el = document.getElementById(elementId)
    if (el) modal.value = new Modal(el)
  })

  onUnmounted(() => modal.value?.destroy())

  return {
    show: () => modal.value?.show(),
    hide: () => modal.value?.hide(),
    toggle: () => modal.value?.toggle(),
  }
}
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Modal } from 'flowbite'

  export let open = false

  let modalEl: HTMLDivElement
  let instance: InstanceType<typeof Modal>

  onMount(() => {
    instance = new Modal(modalEl, { backdrop: 'static' })
  })

  onDestroy(() => instance?.destroy())

  $: if (instance) {
    open ? instance.show() : instance.hide()
  }
</script>

<div bind:this={modalEl} class="fixed hidden" tabindex="-1">
  <slot />
</div>
```

---

## Instance Management — `getOrCreateInstance`

Flowbite uses a static registry to prevent duplicate initialization:

```ts
import { Modal } from 'flowbite'

const el = document.querySelector('#my-modal')

// Safe to call multiple times — returns existing instance if already created
const modal = Modal.getInstance(el)      // null if not initialized
const modal2 = Modal.getOrCreateInstance(el)  // creates if not exists

// Useful in event handlers where you don't hold a reference:
document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('[data-modal-toggle]')
  if (!target) return
  const modalId = target.getAttribute('data-modal-toggle')
  const modalEl = document.getElementById(modalId)
  Modal.getOrCreateInstance(modalEl).toggle()
})
```
