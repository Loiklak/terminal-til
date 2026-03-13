import { describe, it, expect, beforeEach } from "vitest";
import { setTheme, getTheme } from "./theme";

describe("setTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("should add the scheme class and persist to localStorage", () => {
    setTheme("dracula");

    expect(document.documentElement.classList.contains("dracula")).toBe(true);
    expect(localStorage.getItem("riced-scheme")).toBe("dracula");
  });

  it("should remove previous scheme classes", () => {
    setTheme("catppuccin");
    setTheme("nord");

    expect(document.documentElement.classList.contains("catppuccin")).toBe(false);
    expect(document.documentElement.classList.contains("nord")).toBe(true);
  });
});

describe("getTheme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the stored scheme", () => {
    localStorage.setItem("riced-scheme", "gruvbox");

    expect(getTheme()).toBe("gruvbox");
  });

  it("should return catppuccin when nothing is stored", () => {
    expect(getTheme()).toBe("catppuccin");
  });

  it("should return catppuccin for invalid values", () => {
    localStorage.setItem("riced-scheme", "invalid-theme");

    expect(getTheme()).toBe("catppuccin");
  });
});
