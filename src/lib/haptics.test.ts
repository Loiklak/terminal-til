import { describe, it, expect, vi, beforeEach } from "vitest";

const mockTrigger = vi.fn();
vi.mock("web-haptics", () => ({
  WebHaptics: class {
    trigger = mockTrigger;
  },
}));

import { triggerCelebration } from "./haptics";

describe("triggerCelebration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger nudge for terminal mode", () => {
    triggerCelebration("terminal");

    expect(mockTrigger).toHaveBeenCalledWith("nudge");
  });

  it("should trigger success for confetti mode", () => {
    triggerCelebration("confetti");

    expect(mockTrigger).toHaveBeenCalledWith("success");
  });

  it("should not trigger anything for none mode", () => {
    triggerCelebration("none");

    expect(mockTrigger).not.toHaveBeenCalled();
  });
});
