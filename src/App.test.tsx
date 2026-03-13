import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("@/lib/store/local-storage", () => ({
  localStorageStore: {
    getAll: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue({
      id: "1",
      content: "test",
      createdAt: Date.now(),
    }),
  },
}));

describe("App", () => {
  it("renders the app header", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText("terminal-til")).toBeInTheDocument();
  });

  it("renders the input placeholder", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(
      screen.getByPlaceholderText("what did you learn today?"),
    ).toBeInTheDocument();
  });
});
