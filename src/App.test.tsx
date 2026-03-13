import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { StoreProvider } from "@/lib/store/context";
import { createTILStoreWithDefaults } from "@/test/factories/store";
import { createTILWithDefaults } from "@/test/factories/til";
import type { TILStore } from "@/lib/store/interface";

vi.mock("web-haptics", () => ({
  WebHaptics: class {
    trigger = vi.fn();
  },
}));

type SetupParameters = {
  store: TILStore;
};

const setup = async (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    store: createTILStoreWithDefaults(),
  };

  const { store } = { ...defaults, ...params };
  const user = userEvent.setup();

  await act(async () => {
    render(
      <StoreProvider store={store}>
        <App />
      </StoreProvider>,
    );
  });

  return { user };
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render the app header", async () => {
    await setup();

    expect(screen.getByText("terminal-til")).toBeVisible();
  });

  it("should render the input placeholder", async () => {
    await setup();

    expect(screen.getByPlaceholderText("what did you learn today?")).toBeVisible();
  });

  it("should persist new entry via store and display it", async () => {
    const content = "new learning";
    const add = vi.fn().mockResolvedValue(createTILWithDefaults({ content }));
    const store = createTILStoreWithDefaults({ add });
    const { user } = await setup({ store });

    const input = screen.getByPlaceholderText("what did you learn today?");
    await user.type(input, `${content}{Enter}`);

    expect(add).toHaveBeenCalledWith(content, undefined);
    expect(await screen.findByText(content)).toBeVisible();
  });

  it("should not set newEntryId when animation mode is none", async () => {
    localStorage.setItem("riced-animation", "none");
    const content = "quiet learning";
    const add = vi.fn().mockResolvedValue(createTILWithDefaults({ content }));
    const store = createTILStoreWithDefaults({ add });
    const { user } = await setup({ store });

    const input = screen.getByPlaceholderText("what did you learn today?");
    await user.type(input, `${content}{Enter}`);

    const entry = await screen.findByText(content);
    expect(entry.closest(".animate-entry-in")).not.toBeInTheDocument();
  });

  it("should delete entry via store and remove it from the feed", async () => {
    const id = "to-delete";
    const content = "will be deleted";
    const deleteFn = vi.fn().mockResolvedValue(undefined);
    const store = createTILStoreWithDefaults({
      getAll: vi
        .fn()
        .mockResolvedValue([createTILWithDefaults({ id, content, createdAt: Date.now() })]),
      delete: deleteFn,
    });
    const { user } = await setup({ store });

    expect(screen.getByText(content)).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(deleteFn).toHaveBeenCalledWith(id);
    expect(screen.queryByText(content)).not.toBeInTheDocument();
  });
});
