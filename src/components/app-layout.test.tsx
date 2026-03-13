import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppLayout } from "./app-layout";

const setup = () => {
  return render(
    <AppLayout>
      <p>child content</p>
    </AppLayout>,
  );
};

describe("AppLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render the header", () => {
    setup();

    expect(screen.getByText("terminal-til")).toBeVisible();
  });

  it("should render children", () => {
    setup();

    expect(screen.getByText("child content")).toBeVisible();
  });
});
