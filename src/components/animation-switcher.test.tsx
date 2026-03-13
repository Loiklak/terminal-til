import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnimationSwitcher, getAnimationEmoji } from "./animation-switcher";
import type { AnimationMode } from "@/lib/animation";

type SetupParameters = {
  active: AnimationMode;
  onChange: (mode: AnimationMode) => void;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    active: "terminal",
    onChange: vi.fn(),
  };

  const { active, onChange } = { ...defaults, ...params };
  const user = userEvent.setup();

  const renderResult = render(<AnimationSwitcher active={active} onChange={onChange} />);

  return { ...renderResult, user, onChange };
};

describe("AnimationSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render all animation mode buttons", () => {
    setup();

    expect(screen.getByRole("button", { name: "Switch to Terminal animation" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to Confetti animation" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to None animation" })).toBeVisible();
  });

  it("should mark active mode as pressed", () => {
    setup({ active: "confetti" });

    expect(screen.getByRole("button", { name: "Switch to Confetti animation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Switch to Terminal animation" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("should call onChange and persist when a mode is clicked", async () => {
    const onChange = vi.fn();
    const { user } = setup({ onChange });

    await user.click(screen.getByRole("button", { name: "Switch to Confetti animation" }));

    expect(onChange).toHaveBeenCalledWith("confetti");
    expect(localStorage.getItem("riced-animation")).toBe("confetti");
  });
});

describe("getAnimationEmoji", () => {
  it("should return the emoji for a known mode", () => {
    expect(getAnimationEmoji("confetti")).toBe("\uD83C\uDF89");
  });

  it("should return the default emoji for an unknown mode", () => {
    expect(getAnimationEmoji("unknown" as AnimationMode)).toBe("\u26A1");
  });
});
