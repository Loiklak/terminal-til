# Frontend Testing

## Running Tests

```bash
pnpm test                              # All tests with coverage
pnpm test:watch                        # Watch mode
pnpm test:watch -- src/path/to/file    # Specific file in watch mode
```

## Coverage Thresholds

Tests fail if below **100% lines** or **100% branches**. Configured in `vite.config.ts` under `test.coverage.thresholds`.

## Setup Function Pattern

Use a typed setup function with defaults for flexible, readable tests:

```tsx
type SetupParameters = {
  isExpanded: boolean;
  label: string;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    isExpanded: false,
    label: "Click me",
  };

  const { isExpanded, label } = { ...defaults, ...params };

  const user = userEvent.setup();

  const renderResult = render(<MyComponent isExpanded={isExpanded} label={label} />);

  return { ...renderResult, user };
};
```

## Queries

Always use `screen` for queries.

**When to use:**

- `getBy*` - element must exist
- `queryBy*` - assert absence (`expect(...).not.toBeInTheDocument()`)
- `findBy*` - wait for async element (1s timeout)

### Selector Priority (most to least preferred)

1. **Accessible to everyone:**
   - `ByRole` - query accessibility tree (best). Use `name` option: `getByRole('button', { name: 'Submit' })`
   - `ByLabelText` - form fields via label
   - `ByPlaceholderText` - when no label available
   - `ByText` - non-interactive elements (div, span)
   - `ByDisplayValue` - form elements with pre-filled values

2. **Semantic:**
   - `ByAltText` - images, areas
   - `ByTitle` - least reliable (screen readers inconsistent)

3. **Escape hatch:**
   - `ByTestId` - last resort for dynamic content

## User Interactions

Use `userEvent` over `fireEvent` for realistic behavior. Always use `userEvent.setup()` for proper event sequencing:

```ts
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.click(screen.getByRole("button", { name: "Submit" }));
```

## Mocking

### Modules and Hooks

Use `vi.mock` to mock modules, hooks, or context-based dependencies:

```ts
vi.mock("@/lib/store/local-storage", () => ({
  localStorageStore: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}));
```

For components that depend on context, wrap the render in a provider with mock values:

```tsx
const setup = () => {
  const mockValue = { user: { name: "John" }, logout: vi.fn() };

  return render(
    <AuthContext.Provider value={mockValue}>
      <MyComponent />
    </AuthContext.Provider>,
  );
};
```

### Factories

Factory functions provide sensible defaults so tests only specify what they care about. One factory file per domain in `src/test/factories/` (e.g., `til.ts`, `user.ts`).

**Rules:**

- **Asserted values must be visible at the call site.** If a test asserts on a value, pass it explicitly into setup — never assert on hidden factory defaults.
- `setup()` with no override → test checks structural behavior (presence/absence), not specific data values.
- `createWithDefaults({ field: value })` → test asserts on or depends on that specific value.

```tsx
// ✅ Asserted value is visible in the test
it("should render the content", () => {
  const content = "vitest is great";
  setup({ entry: createTILWithDefaults({ content }) });
  expect(screen.getByText(content)).toBeVisible();
});

// ✅ No data assertion — structural check, defaults are fine
it("should not render a title when absent", () => {
  setup();
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});

// ❌ Asserted value comes from hidden factory default
it("should render the content", () => {
  setup();
  expect(screen.getByText("some content")).toBeVisible(); // where does this come from?
});
```

### API Layers

Same factory pattern for API/store mocks. Use `vi.fn()` overrides when the test needs to assert on the mock or change its behavior.

```ts
const createUserApiWithDefaults = (overrides?: Partial<UserApi>): UserApi => ({
  getUserById: vi.fn().mockResolvedValue({ id: 1, name: "John" }),
  updateUser: vi.fn().mockResolvedValue({}),
  deleteUser: vi.fn().mockResolvedValue({}),
  ...overrides,
});

// Just checking UI behavior - use defaults
it("should show success message", async () => {
  const { user } = setup();
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByText("Saved!")).toBeVisible();
});

// Override to test error case
it("should show error when save fails", async () => {
  const userApi = createUserApiWithDefaults({
    updateUser: vi.fn().mockRejectedValue(new Error("Failed")),
  });
  const { user } = setup({ userApi });
  // ...
});

// Asserting on mock - pass vi.fn() for method under test
it("should call updateUser with correct data", async () => {
  const updateUser = vi.fn().mockResolvedValue({});
  const userApi = createUserApiWithDefaults({ updateUser });
  const { user } = setup({ userApi });
  // ...
  expect(updateUser).toHaveBeenCalledWith({ body: expectedData });
});
```

### Router

For components using React Router, wrap in `<MemoryRouter>` or mock navigation hooks:

```tsx
import { MemoryRouter } from "react-router";

const setup = () => {
  return render(
    <MemoryRouter initialEntries={["/users/1"]}>
      <MyComponent />
    </MemoryRouter>,
  );
};
```

Or mock `useNavigate` directly:

```ts
const mockNavigate = vi.fn();
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => mockNavigate,
}));
```

## `act()` and Async Components

Components with async effects (e.g. `useEffect` → promise → `setState`) cause "not wrapped in act" warnings.

```ts
// Fix: flush async effects before asserting
await act(async () => { render(<App />) });
```

**Don't wrap by default** — the warning surfaces async behavior your test isn't covering. Only wrap when you know about the effect and deliberately aren't testing it.

## API Assertion Rules

**Reads** — assert on the resulting UI, never on the API call itself. If the UI shows the right data, the read worked.

**Side effects (mutations)** — always assert on the API payload. A UI success message proves the call succeeded, but not that the correct data was sent. Combine both: payload assertion + UI outcome.

**Never assert on mock call counts** (`toHaveBeenCalledTimes`). Call counts are an implementation detail; assert on outcomes instead.

```tsx
// ❌ Read — don't assert on the API call
it("should display user details", async () => {
  setup();
  expect(await screen.findByText("johndoe")).toBeVisible();
  expect(userApi.getUserById).toHaveBeenCalled(); // REMOVE — UI already proves it
});

// ❌ Call count — implementation coupling
expect(userApi.getUserById).toHaveBeenCalledTimes(2); // REMOVE

// ✅ Side effect — assert payload + UI outcome
it("should show success message after sending login token", async () => {
  const adminSendLoginToken = vi.fn().mockResolvedValue({});
  const userApi = createUserApiWithDefaults({
    getUserById: vi.fn().mockResolvedValue({ id: 1, name: "johndoe" }),
    adminSendLoginToken,
  });
  const { user } = setup({ userApi });

  await screen.findByText("johndoe");
  await user.click(screen.getByRole("button", { name: "Send Login Token" }));

  expect(adminSendLoginToken).toHaveBeenCalledWith({ path: { userId: 1 } });
  expect(await screen.findByText("Login token sent successfully")).toBeVisible();
});

// ✅ Side effect with form data — assert assembled payload
it("should submit updated user", async () => {
  const updateUser = vi.fn().mockResolvedValue({});
  const userApi = createUserApiWithDefaults({ updateUser });
  const { user } = setup({ userApi });

  // ... edit form fields ...
  await user.click(screen.getByRole("button", { name: "Save Changes" }));

  expect(updateUser).toHaveBeenCalledWith(
    expect.objectContaining({
      body: expect.objectContaining({ firstName: "NewFirst", lastName: "NewLast" }),
    }),
  );
  expect(await screen.findByRole("button", { name: "Edit" })).toBeVisible();
});
```

## Rules

- Follow **Arrange-Act-Assert** pattern.
- **Avoid magic strings** — use constants.
- **NEVER access component internals** — Do not use refs or internal state to read or modify component behavior in tests. Tests must interact through the UI using `screen` queries and `userEvent`. Verify component state through visible outcomes (text, attributes, disabled states), not internal properties.
- **Write tests first (TDD)** — Catches design flaws early before implementation.
- **Always return render result** from setup function.
- **Use for-of loops** for assertions, not forEach (async failures won't be detected).
- **Always keep `vi.clearAllMocks()`** in beforeEach.
- **Test what the user sees, not what the code does** — See [API Assertion Rules](#api-assertion-rules) for the full policy on when to assert on API calls vs UI.
- **Test names should reflect user outcomes** — "should set user when login succeeds" not "should call getMe".
- **Use expressive variable names** — `userInfo`, `loginResult` not `response`.
- **Question unrealistic tests** — if a scenario can't happen in production, question whether the code is needed.
- **Tests must fail when code breaks** — verify actual behavior, not just that something was called.
- **Use `it.each` for similar tests** — avoid duplicating tests that only differ by a parameter.
- **Keep mocks simple** — `vi.fn()` is enough if you only check arguments, don't mock unused return values.
- **Use descriptive helper names** — `getRequestPassedToNextHandler` > `getPassedRequest`.
- **No `console.*` calls in tests** — `vitest-fail-on-console` fails tests on any `console.log/warn/error/info/debug/assert`. Remove stray console calls. When testing error paths that intentionally trigger `console.error`, mock it **and** assert on it:
  ```ts
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  // ... trigger error path ...
  expect(consoleError).toHaveBeenCalledWith("Expected message", expect.any(Error));
  ```

## Test Organization

Test files are organized with `describe` blocks. Describes define parts of the tested system.

- For a service/helpers test file: one describe for each method/function.
- For a component test file: one describe for each UI element tested. Prefer the trigger element when ambiguous (e.g., button opens a modal → describe should be the button).

## Template

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { MyComponent } from "./MyComponent";

type SetupParameters = {
  // Define component props
};

describe("MyComponent", () => {
  const setup = (params?: Partial<SetupParameters>) => {
    const defaults: SetupParameters = {
      // Set defaults
    };

    const props = { ...defaults, ...params };
    const user = userEvent.setup();

    const renderResult = render(<MyComponent {...props} />);

    return { ...renderResult, user };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    // Arrange & Act (render)
    setup();

    // Assert
    expect(screen.getByText("Expected text")).toBeVisible();
  });

  it("should handle click", async () => {
    // Arrange
    const { user } = setup();

    // Act
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Assert
    expect(screen.getByText("Submitted")).toBeVisible();
  });
});
```
