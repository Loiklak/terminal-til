# Frontend Architecture

## Store Layer

The store layer follows a **context + interface** pattern that separates concerns cleanly:

1. **Interface** (`src/lib/store/interface.ts`) — defines the `TILStore` contract. Application code only depends on this.
2. **Implementations** (`src/lib/store/local-storage.ts`, future: IndexedDB, Firebase, etc.) — concrete stores that satisfy the interface.
3. **Context** (`src/lib/store/context.tsx`) — provides the store to the React tree via `StoreProvider` and `useStore()`.
4. **Wiring** (`src/main.tsx`) — the only place that knows which implementation is active.

### Why

- `App` and all components are unaware of the concrete store — they consume `useStore()` and get a `TILStore`.
- Swapping implementations (localStorage → IndexedDB → Firebase) means changing one line in `main.tsx`.
- Tests inject mock stores via the provider — no `vi.mock` hoisting issues, and test factories work cleanly.

### Testing

- **Store implementations** are unit tested directly (e.g., `local-storage.test.ts` hits real `localStorage`).
- **Components** receive a mock store through `StoreProvider` in their setup function, using the factory from `src/test/factories/store.ts`.
- **Context guard** is tested separately — `useStore()` throws when called outside a provider.
