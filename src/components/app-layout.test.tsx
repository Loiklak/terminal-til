import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppLayout } from "./app-layout";
import type { AnimationMode } from "@/lib/animation";
import type { Scheme } from "@/lib/theme";

type SetupParameters = {
  animationMode: AnimationMode;
  onAnimationChange: (mode: AnimationMode) => void;
  theme: Scheme;
  onThemeChange: (scheme: Scheme) => void;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    animationMode: "terminal",
    onAnimationChange: vi.fn(),
    theme: "catppuccin",
    onThemeChange: vi.fn(),
  };

  const { animationMode, onAnimationChange, theme, onThemeChange } = { ...defaults, ...params };

  return render(
    <AppLayout
      animationMode={animationMode}
      onAnimationChange={onAnimationChange}
      theme={theme}
      onThemeChange={onThemeChange}
    >
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

  it("should render the settings trigger", () => {
    setup();

    expect(screen.getByRole("button", { name: "Settings" })).toBeVisible();
  });
});
