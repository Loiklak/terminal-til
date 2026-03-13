import { vi } from "vitest";
import type { TILStore } from "@/lib/store/interface";
import { createTILWithDefaults } from "./til";

type MockTILStore = {
  [K in keyof TILStore]: ReturnType<typeof vi.fn>;
};

export const createTILStoreWithDefaults = (overrides?: Partial<MockTILStore>): MockTILStore => ({
  getAll: vi.fn().mockResolvedValue([]),
  add: vi
    .fn()
    .mockImplementation((content, title) =>
      Promise.resolve(createTILWithDefaults({ content, title })),
    ),
  ...overrides,
});
