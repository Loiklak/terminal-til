import type { TIL } from "@/lib/store/interface";

export const createTILWithDefaults = (overrides?: Partial<TIL>): TIL => ({
  id: "test-id",
  content: "learned about testing",
  createdAt: new Date(2026, 0, 15, 14, 30).getTime(),
  ...overrides,
});
