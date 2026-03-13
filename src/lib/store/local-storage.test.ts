import { describe, it, expect, beforeEach, vi } from "vitest";
import { localStorageStore } from "./local-storage";

const STORAGE_KEY = "til-entries";

describe("localStorageStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return empty array when nothing stored", async () => {
      const result = await localStorageStore.getAll();

      expect(result).toEqual([]);
    });

    it("should return entries sorted by createdAt descending", async () => {
      const entries = [
        { id: "1", content: "old", createdAt: 1000 },
        { id: "2", content: "new", createdAt: 2000 },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      const result = await localStorageStore.getAll();

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
    });

    it("should return empty array for corrupted JSON", async () => {
      localStorage.setItem(STORAGE_KEY, "not-valid-json");

      const result = await localStorageStore.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("add", () => {
    it("should add an entry and return it", async () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValue(
        "test-uuid" as `${string}-${string}-${string}-${string}-${string}`,
      );

      const entry = await localStorageStore.add("learned something");

      expect(entry).toEqual(
        expect.objectContaining({
          id: "test-uuid",
          content: "learned something",
        }),
      );
      expect(entry.createdAt).toBeGreaterThan(0);
    });

    it("should include title when provided", async () => {
      const entry = await localStorageStore.add("content", "my title");

      expect(entry.title).toBe("my title");
    });

    it("should not include title when not provided", async () => {
      const entry = await localStorageStore.add("content");

      expect(entry).not.toHaveProperty("title");
    });

    it("should persist the entry to localStorage", async () => {
      await localStorageStore.add("first");
      await localStorageStore.add("second");

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(2);
      expect(stored[0].content).toBe("second");
    });
  });
});
