# Frontend Testing

## `act()` and async components

Components with async effects (e.g. `useEffect` → promise → `setState`) cause "not wrapped in act" warnings.

```ts
// Fix: flush async effects before asserting
await act(async () => { render(<App />) });
```

**Don't wrap by default** — the warning surfaces async behavior your test isn't covering. Only wrap when you know about the effect and deliberately aren't testing it.

## Mocking stores

```ts
vi.mock("@/lib/store/local-storage", () => ({
  localStorageStore: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}));
```

Use `findBy*` (async) for elements that appear after async resolution. Use `getBy*` (sync) for elements present on first render.
