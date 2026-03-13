import { createContext, useContext } from "react";
import type { TILStore } from "./interface";

const StoreContext = createContext<TILStore | null>(null);

export function StoreProvider({ store, children }: { store: TILStore; children: React.ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): TILStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}
