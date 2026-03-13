import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TILEntry } from "./til-entry";
import { createTILWithDefaults } from "@/test/factories/til";
import type { TIL } from "@/lib/store/interface";

type SetupParameters = {
  entry: TIL;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    entry: createTILWithDefaults(),
  };

  const { entry } = { ...defaults, ...params };

  return render(<TILEntry entry={entry} />);
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
});
