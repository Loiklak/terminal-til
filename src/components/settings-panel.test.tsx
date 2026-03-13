import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettingsPanel } from "./settings-panel";
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
  const user = userEvent.setup();

  const renderResult = render(
    <SettingsPanel
      animationMode={animationMode}
      onAnimationChange={onAnimationChange}
      theme={theme}
      onThemeChange={onThemeChange}
    />,
  );

  return { ...renderResult, user, onAnimationChange, onThemeChange };
};

describe("SettingsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render the settings trigger button", () => {
    setup();

    expect(screen.getByRole("button", { name: "Settings" })).toBeVisible();
  });

  it("should not show panel content when closed", () => {
    setup();

    expect(screen.queryByText("theme")).not.toBeInTheDocument();
  });

  it("should show panel content when trigger is clicked", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);
    expect(screen.getAllByText("animation").length).toBeGreaterThan(0);
  });

  it("should show theme and animation switchers when open", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(screen.getAllByRole("navigation", { name: "Theme switcher" }).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("navigation", { name: "Animation switcher" }).length,
    ).toBeGreaterThan(0);
  });

  it("should close when clicking outside the panel", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);

    await user.click(document.body);

    expect(screen.queryByText("theme")).not.toBeInTheDocument();
  });

  it("should close when pressing Escape", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);

    await user.keyboard("{Escape}");

    expect(screen.queryByText("theme")).not.toBeInTheDocument();
  });

  it("should not close on non-Escape key press", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));

    await user.keyboard("a");

    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);
  });

  it("should have expanded state on trigger button", async () => {
    const { user } = setup();

    const trigger = screen.getByRole("button", { name: "Settings" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("should close when toggle button is clicked again", async () => {
    const { user } = setup();

    const trigger = screen.getByRole("button", { name: "Settings" });
    await user.click(trigger);
    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);

    await user.click(trigger);
    expect(screen.queryByText("theme")).not.toBeInTheDocument();
  });

  it("should close when mobile backdrop is clicked", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getAllByText("theme").length).toBeGreaterThan(0);

    await user.click(screen.getByTestId("settings-backdrop"));

    expect(screen.queryByText("theme")).not.toBeInTheDocument();
  });
});
