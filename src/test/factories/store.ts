import { vi } from "vitest";
import type { TILStore } from "@/lib/store/interface";
import { createTILWithDefaults } from "./til";

export type MockTILStore = {
  [K in keyof TILStore]: TILStore[K] & ReturnType<typeof vi.fn>;
};

export const createTILStoreWithDefaults = (overrides?: Partial<MockTILStore>): MockTILStore => ({
  getAll: vi.fn<TILStore["getAll"]>().mockResolvedValue([]),
  add: vi
    .fn<TILStore["add"]>()
    .mockImplementation((content: string, title?: string) =>
      Promise.resolve(createTILWithDefaults({ content, title })),
    ),
  ...overrides,
});
