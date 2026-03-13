import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { StoreProvider } from "@/lib/store/context";
import { createTILStoreWithDefaults } from "@/test/factories/store";
import { createTILWithDefaults } from "@/test/factories/til";
import type { TILStore } from "@/lib/store/interface";

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
});
