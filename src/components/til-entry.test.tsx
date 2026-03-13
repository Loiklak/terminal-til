import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TILEntry } from "./til-entry";
import { createTILWithDefaults } from "@/test/factories/til";
import type { TIL } from "@/lib/store/interface";

type SetupParameters = {
  entry: TIL;
  onDelete: (id: string) => void;
  isNew: boolean;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    entry: createTILWithDefaults(),
    onDelete: vi.fn(),
    isNew: false,
  };

  const { entry, onDelete, isNew } = { ...defaults, ...params };
  const user = userEvent.setup();

  const renderResult = render(<TILEntry entry={entry} onDelete={onDelete} isNew={isNew} />);

  return { ...renderResult, user, onDelete };
};

describe("TILEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the content", () => {
    const content = "vitest is great";
    setup({ entry: createTILWithDefaults({ content }) });

    expect(screen.getByText(content)).toBeVisible();
  });

  it("should render the formatted time", () => {
    const createdAt = new Date(2026, 0, 15, 14, 30).getTime();
    setup({ entry: createTILWithDefaults({ createdAt }) });

    expect(screen.getByText("14:30")).toBeVisible();
  });

  it("should render the title when provided", () => {
    const title = "Testing 101";
    setup({ entry: createTILWithDefaults({ title }) });

    expect(screen.getByText(title)).toBeVisible();
  });

  it("should not render a title when absent", () => {
    setup();

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("should call onDelete with entry id when delete button is clicked", async () => {
    const id = "entry-to-delete";
    const onDelete = vi.fn();
    const { user } = setup({ entry: createTILWithDefaults({ id }), onDelete });

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(id);
  });

  it("should apply slide-in animation class when isNew is true", () => {
    const content = "new entry";
    const { container } = setup({
      entry: createTILWithDefaults({ content }),
      isNew: true,
    });

    expect(container.firstChild).toHaveClass("animate-entry-in");
  });

  it("should not apply slide-in animation class when isNew is false", () => {
    const { container } = setup({ isNew: false });

    expect(container.firstChild).not.toHaveClass("animate-entry-in");
  });
});
