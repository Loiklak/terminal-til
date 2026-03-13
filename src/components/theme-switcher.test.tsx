import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeSwitcher, getThemeEmoji } from "./theme-switcher";
import type { Scheme } from "@/lib/theme";

type SetupParameters = {
  active: Scheme;
  onChange: (scheme: Scheme) => void;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    active: "catppuccin",
    onChange: vi.fn(),
  };

  const { active, onChange } = { ...defaults, ...params };
  const user = userEvent.setup();

  const renderResult = render(<ThemeSwitcher active={active} onChange={onChange} />);

  return { ...renderResult, user, onChange };
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

  it("should mark the active theme as pressed", () => {
    setup({ active: "dracula" });

    expect(screen.getByRole("button", { name: "Switch to Dracula theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Switch to Catppuccin theme" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("should call onChange and persist on click", async () => {
    const onChange = vi.fn();
    const { user } = setup({ onChange });

    await user.click(screen.getByRole("button", { name: "Switch to Dracula theme" }));

    expect(onChange).toHaveBeenCalledWith("dracula");
    expect(document.documentElement.classList.contains("dracula")).toBe(true);
  });
});

describe("getThemeEmoji", () => {
  it("should return the emoji for a known scheme", () => {
    expect(getThemeEmoji("dracula")).toBe("\uD83E\uDDDB");
  });

  it("should return the default emoji for an unknown scheme", () => {
    expect(getThemeEmoji("unknown" as Parameters<typeof getThemeEmoji>[0])).toBe("\uD83D\uDC31");
  });
});
