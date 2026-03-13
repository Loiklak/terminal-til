import type { TIL, TILStore } from "./interface.ts";

const STORAGE_KEY = "til-entries";

function readEntries(): TIL[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TIL[];
  } catch {
    return [];
  }
}

function writeEntries(entries: TIL[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export const localStorageStore: TILStore = {
  async getAll() {
    return readEntries().sort((a, b) => b.createdAt - a.createdAt);
  },

  async add(content, title) {
    const entry: TIL = {
      id: crypto.randomUUID(),
      content,
      ...(title ? { title } : {}),
      createdAt: Date.now(),
    };
    const entries = readEntries();
    entries.unshift(entry);
    writeEntries(entries);
    return entry;
  },
};
