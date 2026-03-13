import { describe, it, expect, beforeEach } from "vitest";
import { getAnimation, setAnimation } from "./animation";

const STORAGE_KEY = "riced-animation";

describe("animation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getAnimation", () => {
    it("should return terminal as default when nothing stored", () => {
      expect(getAnimation()).toBe("terminal");
    });

    it("should return stored animation mode", () => {
      localStorage.setItem(STORAGE_KEY, "confetti");

      expect(getAnimation()).toBe("confetti");
    });

    it("should return terminal for invalid stored value", () => {
      localStorage.setItem(STORAGE_KEY, "invalid");

      expect(getAnimation()).toBe("terminal");
    });
  });

  describe("setAnimation", () => {
    it("should persist animation mode to localStorage", () => {
      setAnimation("confetti");

      expect(localStorage.getItem(STORAGE_KEY)).toBe("confetti");
    });

    it("should persist none mode", () => {
      setAnimation("none");

      expect(localStorage.getItem(STORAGE_KEY)).toBe("none");
    });
  });
});
