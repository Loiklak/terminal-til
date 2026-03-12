# MVP PRD — Terminal TIL

> Capture a learning, see your learnings. That's it.

---

## 1. What this is

A single-page app where you type what you learned today and it shows up in a feed. Terminal aesthetic. No accounts, no backend, no tags, no search. localStorage only.

The entire interaction is: type, submit, scroll.

---

## 2. Data model

```ts
interface TIL {
  id: string         // nanoid or crypto.randomUUID()
  title?: string     // optional short summary
  content: string    // the learning, plain text
  createdAt: number  // Date.now() timestamp
}
```

Title is optional. If provided, the feed shows it bold above the content. If omitted, the entry renders content only. No tags, no categories, no metadata beyond timestamp.

---

## 3. Storage

### Interface

```ts
interface TILStore {
  getAll(): Promise<TIL[]>
  add(content: string, title?: string): Promise<TIL>
}
```

Two methods. No delete, no update, no query. The interface exists so future adapters (IndexedDB, Firebase, etc.) can swap in without touching UI code.

### localStorage adapter

- Key: `"til-entries"`
- Value: JSON array of `TIL[]`
- `getAll()` parses and returns sorted by `createdAt` descending (newest first)
- `add()` creates a `TIL`, prepends to the array, writes back, returns the new entry

### Why Promise-based for localStorage?

localStorage is synchronous, but the interface returns Promises. This is intentional — every future adapter (IndexedDB, network) will be async. Paying the trivial cost of `Promise.resolve()` now means zero refactoring later.

---

## 4. App layout

```
+--------------------------------------------------+
|  terminal-til              [theme switcher pills] |
+--------------------------------------------------+
|                                                  |
|  $ <input: "what did you learn today?">          |
|                                                  |
|  ── today ────────────────────────────────────── |
|                                                  |
|  > oklch color spaces                            |
|    CSS oklch() lets browsers interpolate in a    |
|    perceptually uniform color space              |
|    12:34                                         |
|                                                  |
|  > Tailwind v4 dropped JS config entirely        |
|    11:02                                         |
|                                                  |
|  ── yesterday ───────────────────────────────── |
|                                                  |
|  > pnpm dlx is the equivalent of npx            |
|    18:45                                         |
|                                                  |
+--------------------------------------------------+
```

### Header
- App name (`terminal-til`) in `--primary` color, left-aligned
- Theme switcher pills, right-aligned
- Sits on `--base` background

### Input area
- Two inputs stacked:
  - Title input: small, `--muted-foreground` placeholder `"title (optional)"`, no prefix
  - Content input: `$` prefix (terminal prompt style), placeholder `"what did you learn today?"`
- Submit on Enter from content input (title input Enter moves focus to content)
- Both fields clear after submit
- No submit button — Enter is the only way
- Content is required; title is optional
- Sits on `--background` (crust level)

### Feed
- Entries grouped by date: "today", "yesterday", then date strings (e.g. "Mar 10")
- Each group has a separator line with the date label
- Each entry shows:
  - `>` prefix in `--primary`
  - Title (if present) in `--foreground`, bold, on the same line as `>`
  - Content text in `--foreground` (below title if title exists, on the `>` line if no title)
  - Time (HH:MM) in `--muted-foreground`, below the content
- Newest first within each group
- No pagination — render all entries (localStorage won't have thousands)

---

## 5. Components needed

| Component | Type | Notes |
|---|---|---|
| `AppLayout` | App shell | Header + main content area |
| `ThemeSwitcher` | Already exists | Move from App.tsx demo into header |
| `TILInput` | Feature component | Wraps shadcn Input with `$` prefix, Enter-to-submit |
| `TILFeed` | Feature component | Groups entries by date, renders list |
| `TILEntry` | Feature component | Single entry: `>` prefix, content, time |
| `DateSeparator` | UI component | `── Mar 10 ──` style divider |
| `Input` | shadcn | Need to add via shadcn CLI |

### File structure

```
src/
  components/
    ui/
      button.tsx          (exists)
      input.tsx           (add via shadcn)
    app-layout.tsx
    theme-switcher.tsx    (extract from current App.tsx)
    til-input.tsx
    til-feed.tsx
    til-entry.tsx
    date-separator.tsx
  lib/
    theme.ts              (exists)
    store/
      interface.ts        (TILStore interface + TIL type)
      local-storage.ts    (localStorage adapter)
```

---

## 6. Behavior

### Creating a TIL
1. User types in the input
2. Presses Enter
3. Input clears
4. New entry appears at the top of the feed instantly
5. Entry persists across page refreshes (localStorage)

### Empty state
When there are no entries, show a single line below the input:

```
  no learnings yet. type something above.
```

In `--muted-foreground`, centered.

### Loading
`getAll()` is called on mount. Since localStorage is instant, no loading state needed. But the async interface means a future adapter could show a brief loading state if needed — leave that for later.

---

## 7. What's explicitly out of scope

- Delete / edit entries
- Tags
- Search / filter
- Command palette
- Riced components (Sparkline, StatusBar, etc.)
- Any backend or auth
- Mobile-specific layout (it should work on mobile via responsive defaults, but no dedicated mobile UX)

---

## 8. Implementation order

1. **Storage** — interface + localStorage adapter (no UI dependency)
2. **Input component** — add shadcn input, build TILInput
3. **Feed components** — DateSeparator, TILEntry, TILFeed
4. **App layout** — wire everything together, move theme switcher to header
5. **Polish** — empty state, focus management (auto-focus input on load)
