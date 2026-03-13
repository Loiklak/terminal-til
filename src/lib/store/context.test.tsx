import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStore } from "./context";

describe("useStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw when used outside StoreProvider", () => {
    expect(() => renderHook(() => useStore())).toThrow(
      "useStore must be used within a StoreProvider",
    );
  });
});
