import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConfettiBurst } from "./confetti-burst";

type SetupParameters = {
  active: boolean;
  onComplete: () => void;
};

const setup = (params?: Partial<SetupParameters>) => {
  const defaults: SetupParameters = {
    active: false,
    onComplete: vi.fn(),
  };

  const { active, onComplete } = { ...defaults, ...params };

  const renderResult = render(<ConfettiBurst active={active} onComplete={onComplete} />);

  return { ...renderResult, onComplete };
};

describe("ConfettiBurst", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("should not render particles when inactive", () => {
    setup();

    expect(screen.queryByTestId("confetti-burst")).not.toBeInTheDocument();
  });

  it("should render particles when active", () => {
    setup({ active: true });

    expect(screen.getByTestId("confetti-burst")).toBeVisible();
  });

  it("should call onComplete after animation duration", () => {
    const onComplete = vi.fn();
    setup({ active: true, onComplete });

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it("should remove particles after animation completes", () => {
    setup({ active: true });

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.queryByTestId("confetti-burst")).not.toBeInTheDocument();
  });
});
