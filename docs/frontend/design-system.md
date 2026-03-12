# Riced UI — Design System

> A web app design system with riced terminal aesthetics.
> Built on shadcn/ui + Radix + Tailwind CSS v4 + CSS variables.

---

## 1. Vision

A design system that looks and feels like a premium riced terminal — monospace typography, layered dark surfaces, semantic color, Powerline-style UI patterns — implemented on top of shadcn/ui so every component is fully accessible and keyboard-navigable out of the box.

The result should feel like using a well-configured Kitty or Alacritty terminal, but for a real web application.

---

## 2. Stack

| Layer | Technology | Role |
|---|---|---|
| Primitives | Radix UI (via shadcn) | Accessibility, ARIA, keyboard nav |
| Components | shadcn/ui | Component structure, copied into `src/components/ui/` — edit directly |
| Styling | Tailwind CSS v4 | Utility layer, CSS-first config via `@theme` |
| Theming | CSS custom properties | Token system, one class per scheme |
| Token codegen | TypeScript → CSS | Type-safe scheme definitions, generated output |
| Typography | JetBrains Mono | Monospace throughout |
| Icons | Lucide React | Lightweight, consistent |

---

## 3. Project setup

```bash
# 1. Install Tailwind CSS v4 into your existing Vite app
pnpm add tailwindcss @tailwindcss/vite

# 2. Wire up the Vite plugin (vite.config.ts)
import tailwindcss from "@tailwindcss/vite"
export default { plugins: [tailwindcss()] }

# 3. Init shadcn — choose "vite" when prompted for framework
pnpm dlx shadcn@latest init

# 4. Install core components
pnpm dlx shadcn@latest add button input select dialog dropdown-menu tabs
pnpm dlx shadcn@latest add command tooltip toggle badge alert progress
pnpm dlx shadcn@latest add avatar separator card table

# 5. Font
pnpm add @fontsource/jetbrains-mono
```

```ts
// main.tsx — import font weights
import "@fontsource/jetbrains-mono/400.css"
import "@fontsource/jetbrains-mono/700.css"
```

During `shadcn init`, select **Slate** as base color. Everything gets overridden by the token system.

---

## 4. Token system

### Architecture: codegen from TypeScript

Scheme colors are defined as typed TypeScript objects. A build script generates the CSS. This guarantees every scheme is complete — a missing token is a type error, not a runtime bug with invisible text.

```
src/tokens/
  schema.ts              ← TypeScript interface (the contract)
  schemes/
    catppuccin.ts        ← full token set, satisfies Scheme
    tokyonight.ts
    dracula.ts
    gruvbox.ts
    nord.ts
  generate.ts            ← reads schemes, writes CSS
  generated-themes.css   ← output (gitignored or committed, your call)
```

### The Scheme interface

Every scheme must define every token. No partials, no stubs.

```ts
// src/tokens/schema.ts
export interface Scheme {
  name: string
  className: string

  // shadcn core tokens (oklch values as strings)
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  radius: string

  // Surface scale — the depth system
  crust: string
  base: string
  surface0: string
  surface1: string

  // Semantic palette
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorInfo: string

  // Motion
  durationFast: string
  durationNormal: string
  easeDefault: string
}
```

### Generator

```ts
// src/tokens/generate.ts
// Reads each scheme, outputs CSS like:
//
// .catppuccin {
//   --background: oklch(0.25 0.02 264);
//   --foreground: oklch(0.87 0.02 275);
//   ...
// }
//
// :root gets the default scheme (catppuccin).
// Run via: pnpm generate-tokens (add to package.json scripts)
```

### Color format

Use **oklch** values. This is what modern shadcn + Tailwind v4 expects. Tailwind v4 handles opacity natively — no more space-separated channel hacks from v3.

```css
--primary: oklch(0.72 0.19 310);    /* correct — v4 */
--primary: 203 166 247;              /* wrong — v3 pattern */
```

### Variable naming

Follow shadcn's convention so built-in components work without modification:

```css
/* shadcn core — components reference these directly */
--background        /* page bg (maps to: crust) */
--foreground        /* default text */
--card              /* card surface (maps to: base) */
--card-foreground
--popover           /* dropdowns, tooltips (maps to: base) */
--popover-foreground
--primary           /* accent color */
--primary-foreground
--secondary         /* maps to: surface0 */
--secondary-foreground
--muted             /* maps to: surface1 */
--muted-foreground  /* maps to: overlay */
--accent            /* hover states */
--accent-foreground
--destructive       /* maps to: red */
--destructive-foreground
--border            /* maps to: surface1 */
--input             /* input border */
--ring              /* focus ring */
--radius            /* per-scheme border radius */

/* Extended: surface scale */
--crust             /* deepest background */
--base              /* app shell (sidebar, navbar) */
--surface-0         /* cards, inputs */
--surface-1         /* hover, active, selected */

/* Extended: semantic palette */
--color-success     /* green */
--color-warning     /* yellow */
--color-error       /* red */
--color-info        /* blue */

/* Extended: motion */
--duration-fast     /* e.g. 100ms */
--duration-normal   /* e.g. 200ms */
--ease-default      /* e.g. cubic-bezier(0.4, 0, 0.2, 1) */
```

### Tailwind v4 integration

Tailwind v4 uses CSS-first configuration. No `tailwind.config.ts`. Register tokens via `@theme` in your CSS:

```css
@import "tailwindcss";
@import "./tokens/generated-themes.css";

@theme {
  --color-crust: var(--crust);
  --color-base: var(--base);
  --color-surface-0: var(--surface-0);
  --color-surface-1: var(--surface-1);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  --color-info: var(--color-info);

  --font-sans: "JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
}
```

This makes utilities like `bg-crust`, `text-success`, `font-sans` work natively.

---

## 5. Typography

Monospace everywhere. This is non-negotiable — the entire aesthetic depends on typographic consistency.

Font stack is configured via `@theme` (see above). No `tailwind.config.ts` needed.

### Font loading

Prevent flash of invisible text (FOIT) and layout shift:

```html
<!-- index.html — preload the primary weight -->
<link rel="preload" href="/path/to/jetbrains-mono-400.woff2"
      as="font" type="font/woff2" crossorigin>
```

The `@fontsource` import handles `font-display: swap` by default. The fallback stack (`ui-monospace, monospace`) is already monospace, so the swap causes minimal layout shift.

---

## 6. Theme engine

Theme switching is pure CSS — swap a class on `<html>`, CSS variables update, every element re-paints. No React state, no useEffect, no event system needed.

### Flash-free initialization

An inline script in `index.html` runs **before the first paint**, synchronously:

```html
<!-- index.html — inside <head>, before any other scripts -->
<script>
  (function() {
    var VALID = ['catppuccin','tokyonight','dracula','gruvbox','nord'];
    var scheme = localStorage.getItem('riced-scheme');
    if (VALID.indexOf(scheme) === -1) scheme = 'catppuccin';
    document.documentElement.classList.add(scheme);
  })();
</script>
```

This prevents the flash-of-wrong-theme that happens when you read localStorage inside React (which runs after paint).

### Corrupted state fallback

If localStorage contains a value not in the valid list, the inline script falls back to `catppuccin`. No broken UI.

### setTheme / getTheme

```ts
// src/lib/theme.ts
const ALL_SCHEMES = ["catppuccin", "tokyonight", "dracula", "gruvbox", "nord"] as const
export type Scheme = (typeof ALL_SCHEMES)[number]

export function setTheme(scheme: Scheme) {
  const root = document.documentElement
  ALL_SCHEMES.forEach(s => root.classList.remove(s))
  root.classList.add(scheme)
  localStorage.setItem("riced-scheme", scheme)
}

export function getTheme(): Scheme {
  const stored = localStorage.getItem("riced-scheme")
  return ALL_SCHEMES.includes(stored as Scheme) ? (stored as Scheme) : "catppuccin"
}
```

### Smooth transitions between themes

```css
html {
  transition: background-color var(--duration-normal) var(--ease-default),
              color var(--duration-normal) var(--ease-default);
}

@media (prefers-reduced-motion: reduce) {
  html { transition: none; }
}
```

Only transition `background-color` and `color`. Not `all` — that animates borders, shadows, and other properties that look wrong mid-transition.

---

## 7. Component overrides

shadcn components live in `src/components/ui/`. Edit them directly — that's the entire point of shadcn. The main changes:

### Button
Add terminal-specific `ghost` variant:

```tsx
// components/ui/button.tsx — add to buttonVariants
ghost: "border border-border bg-transparent text-muted-foreground
        hover:bg-secondary hover:text-foreground",
```

### Input
Add prefix support for the `$` prompt style:

```tsx
// components/ui/input.tsx — wrap in a relative div
<div className="relative flex items-center">
  {prefix && (
    <span className="absolute left-3 text-muted-foreground font-mono text-sm
                     pointer-events-none select-none">
      {prefix}
    </span>
  )}
  <Input className={prefix ? "pl-8" : ""} />
</div>
```

### Badge
Override rounded-full to use scheme radius:

```tsx
className="rounded-[var(--radius)] border px-2 py-0.5 text-xs font-mono"
```

### Command (palette)
Style the prompt icon to match terminal aesthetic:

```tsx
<CommandInput placeholder="Type a command..." className="font-mono text-sm" />
// Replace the default search icon with:
<span className="text-primary mr-2">></span>
```

---

## 8. Custom components (riced/)

These don't exist in shadcn. Built from scratch, consuming only CSS variable tokens.

| Component | Notes |
|---|---|
| `Sparkline` | SVG inline chart, no library needed |
| `PowerlinePrompt` | Pure CSS/JSX, the segmented prompt |
| `CodeBlock` | Wrap shadcn's `ScrollArea`, use `shiki` for syntax highlighting |
| `Neofetch` | Decorative, pure JSX |
| `Stat` | Compose `Card` + `Sparkline` |
| `StatusBar` | Fixed bottom bar, pure layout |
| `AvatarGroup` | Compose shadcn `Avatar` with negative margin overlap |

---

## 9. File structure

```
src/
  main.tsx                      <- font imports, app mount
  App.tsx
  index.css                     <- @import tailwind, @theme, transitions
  components/
    ui/                         <- shadcn components (edit directly)
      button.tsx
      dialog.tsx
      command.tsx
      ...
    riced/                      <- custom components (built from scratch)
      CodeBlock.tsx
      Sparkline.tsx
      PowerlinePrompt.tsx
      StatusBar.tsx
      Stat.tsx
      AvatarGroup.tsx
  lib/
    theme.ts                    <- setTheme / getTheme
  tokens/
    schema.ts                   <- Scheme interface
    generate.ts                 <- build script
    generated-themes.css        <- output consumed by index.css
    schemes/
      catppuccin.ts
      tokyonight.ts
      dracula.ts
      gruvbox.ts
      nord.ts
```

---

## 10. Accessibility

### Contrast requirements

All foreground/background pairs must meet WCAG AA:
- **4.5:1** for normal text (< 18px or < 14px bold)
- **3:1** for large text (>= 18px or >= 14px bold)

Dark-on-dark schemes are the #1 source of contrast failures. When defining a new scheme, check every fg/bg combination — especially `muted-foreground` on `background` and `secondary-foreground` on `card`.

The codegen script should log a warning when any pair falls below AA ratio. This is a build-time safety net, not a runtime check.

### Reduced motion

All animations respect `prefers-reduced-motion: reduce`. The motion tokens (`--duration-fast`, `--duration-normal`) are overridden to `0ms` in that media query:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
  }
}
```

---

## 11. Key constraints

**Never hardcode colors.** Everything goes through CSS variables. `text-[#cba6f7]` is wrong — use `text-primary`.

**Monospace everywhere.** Don't switch to sans-serif for body copy.

**Respect the surface scale.** Cards on `background` use `card`. Dropdowns use `popover`. Don't skip levels or the depth system collapses.

**Radius is per-scheme.** Never hardcode `rounded-lg`. Use `rounded-[var(--radius)]` so Gruvbox stays sharp and Nord stays soft.

**Semantic color only.** Green = success. Red = error. Always. Don't repurpose them decoratively.

**All schemes must be complete.** Every scheme defines every token. No `/* ... */` stubs. The TypeScript interface enforces this at build time.

**No Tailwind v3 patterns.** No `tailwind.config.ts` for theming. No space-separated color channels. Use `@theme` and oklch.
