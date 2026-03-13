import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TILInput } from "./til-input";

type SetupParameters = {
  onSubmit: ReturnType<typeof vi.fn>;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    onSubmit: vi.fn(),
  };

  const { onSubmit } = { ...defaults, ...params };
  const user = userEvent.setup();

  const renderResult = render(<TILInput onSubmit={onSubmit} />);

  return { ...renderResult, user, onSubmit };
};

describe("TILInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the content input with placeholder", () => {
    setup();

    expect(screen.getByPlaceholderText("what did you learn today?")).toBeVisible();
  });

  it("should render the title input with placeholder", () => {
    setup();

    expect(screen.getByPlaceholderText("title (optional)")).toBeVisible();
  });

  it("should submit content on Enter in content field", async () => {
    const onSubmit = vi.fn();
    const { user } = setup({ onSubmit });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "new learning{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("new learning", undefined);
  });

  it("should submit with title when provided", async () => {
    const onSubmit = vi.fn();
    const { user } = setup({ onSubmit });

    const titleInput = screen.getByPlaceholderText("title (optional)");
    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(titleInput, "My Title");
    await user.type(contentInput, "my content{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("my content", "My Title");
  });

  it("should not submit when content is empty", async () => {
    const onSubmit = vi.fn();
    const { user } = setup({ onSubmit });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "   {Enter}");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should clear inputs after submission", async () => {
    const { user } = setup();

    const titleInput = screen.getByPlaceholderText("title (optional)");
    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(titleInput, "Title");
    await user.type(contentInput, "content{Enter}");

    expect(titleInput).toHaveValue("");
    expect(contentInput).toHaveValue("");
  });

  it("should move focus to content input on Enter in title field", async () => {
    const { user } = setup();

    const titleInput = screen.getByPlaceholderText("title (optional)");
    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(titleInput, "Title{Enter}");

    expect(contentInput).toHaveFocus();
  });
});
