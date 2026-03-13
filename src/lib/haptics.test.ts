import { describe, it, expect, vi, beforeEach } from "vitest";
import { triggerCelebration } from "./haptics";

describe("triggerCelebration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "vibrate", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  it("should vibrate with terminal pattern", () => {
    triggerCelebration("terminal");

    expect(navigator.vibrate).toHaveBeenCalledWith([30, 60, 40]);
  });

  it("should vibrate with confetti pattern", () => {
    triggerCelebration("confetti");

    expect(navigator.vibrate).toHaveBeenCalledWith([40, 30, 50, 30, 40]);
  });

  it("should not vibrate for none mode", () => {
    triggerCelebration("none");

    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it("should not throw when vibrate is not supported", () => {
    Object.defineProperty(navigator, "vibrate", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    expect(() => triggerCelebration("terminal")).not.toThrow();
  });
});
