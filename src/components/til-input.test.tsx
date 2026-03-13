import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TILInput } from "./til-input";
import type { AnimationMode } from "@/lib/animation";

type SetupParameters = {
  onSubmit: (content: string, title?: string) => void;
  animationMode: AnimationMode;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    onSubmit: vi.fn(),
    animationMode: "none",
  };

  const { onSubmit, animationMode } = { ...defaults, ...params };
  const user = userEvent.setup();

  const renderResult = render(<TILInput onSubmit={onSubmit} animationMode={animationMode} />);

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

  it("should not submit on Shift+Enter and allow newline", async () => {
    const onSubmit = vi.fn();
    const { user } = setup({ onSubmit });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "line one{Shift>}{Enter}{/Shift}line two");

    expect(onSubmit).not.toHaveBeenCalled();
    expect(contentInput).toHaveValue("line one\nline two");
  });

  it("should show confetti burst on submit in confetti mode", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { user } = setup({ animationMode: "confetti" });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "learned something{Enter}");

    expect(screen.getByTestId("confetti-burst")).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.queryByTestId("confetti-burst")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("should apply terminal flash class on submit in terminal mode", async () => {
    const { user, container } = setup({ animationMode: "terminal" });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "learned something{Enter}");

    const flashDiv = container.querySelector(".animate-terminal-flash");
    expect(flashDiv).toBeInTheDocument();
  });

  it("should remove terminal flash class after duration", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { user, container } = setup({ animationMode: "terminal" });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "learned something{Enter}");

    expect(container.querySelector(".animate-terminal-flash")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(container.querySelector(".animate-terminal-flash")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("should not show confetti in none mode", async () => {
    const { user } = setup({ animationMode: "none" });

    const contentInput = screen.getByPlaceholderText("what did you learn today?");
    await user.type(contentInput, "learned something{Enter}");

    expect(screen.queryByTestId("confetti-burst")).not.toBeInTheDocument();
  });
});
