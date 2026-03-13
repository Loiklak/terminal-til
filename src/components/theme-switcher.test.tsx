import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";

const setup = () => {
  const user = userEvent.setup();
  const renderResult = render(<ThemeSwitcher />);
  return { ...renderResult, user };
};

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("should render all theme buttons", () => {
    setup();

    expect(screen.getByRole("button", { name: "Switch to Catppuccin theme" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to Tokyo Night theme" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to Dracula theme" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to Gruvbox theme" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to Nord theme" })).toBeVisible();
  });

  it("should mark the default theme as pressed", () => {
    setup();

    expect(screen.getByRole("button", { name: "Switch to Catppuccin theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("should switch theme on click", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Switch to Dracula theme" }));

    expect(screen.getByRole("button", { name: "Switch to Dracula theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Switch to Catppuccin theme" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(document.documentElement.classList.contains("dracula")).toBe(true);
  });
});
