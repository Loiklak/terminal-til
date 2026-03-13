import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TILFeed } from "./til-feed";
import { createTILWithDefaults } from "@/test/factories/til";
import type { TIL } from "@/lib/store/interface";

type SetupParameters = {
  entries: TIL[];
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    entries: [],
  };

  const { entries } = { ...defaults, ...params };

  return render(<TILFeed entries={entries} />);
};

describe("TILFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show empty state when no entries", () => {
    setup();

    expect(screen.getByText("no learnings yet. type something above.")).toBeVisible();
  });

  it("should render entries grouped under today", () => {
    const content = "learned today";
    const now = Date.now();
    setup({ entries: [createTILWithDefaults({ content, createdAt: now })] });

    expect(screen.getByText("today")).toBeVisible();
    expect(screen.getByText(content)).toBeVisible();
  });

  it("should render entries grouped under yesterday", () => {
    const content = "learned yesterday";
    const yesterday = Date.now() - 86400000;
    setup({
      entries: [createTILWithDefaults({ content, createdAt: yesterday })],
    });

    expect(screen.getByText("yesterday")).toBeVisible();
    expect(screen.getByText(content)).toBeVisible();
  });

  it("should render older entries with formatted date", () => {
    const content = "learned long ago";
    const oldDate = new Date(2025, 0, 5).getTime();
    setup({
      entries: [createTILWithDefaults({ content, createdAt: oldDate })],
    });

    const expectedLabel = new Date(oldDate).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    expect(screen.getByText(expectedLabel)).toBeVisible();
    expect(screen.getByText(content)).toBeVisible();
  });

  it("should group multiple entries under the same date", () => {
    const now = Date.now();
    const first = "first thing";
    const second = "second thing";
    setup({
      entries: [
        createTILWithDefaults({ id: "1", content: first, createdAt: now }),
        createTILWithDefaults({
          id: "2",
          content: second,
          createdAt: now - 1000,
        }),
      ],
    });

    const todayLabels = screen.getAllByText("today");
    expect(todayLabels).toHaveLength(1);
    expect(screen.getByText(first)).toBeVisible();
    expect(screen.getByText(second)).toBeVisible();
  });
});
