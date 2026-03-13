import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout.tsx";
import { TILInput } from "@/components/til-input.tsx";
import { TILFeed } from "@/components/til-feed.tsx";
import { useStore } from "@/lib/store/context.tsx";
import type { TIL } from "@/lib/store/interface.ts";

function App() {
  const store = useStore();
  const [entries, setEntries] = useState<TIL[]>([]);

  useEffect(() => {
    store.getAll().then(setEntries);
  }, [store]);

  async function handleAdd(content: string, title?: string) {
    const entry = await store.add(content, title);
    setEntries((prev) => [entry, ...prev]);
  }

  async function handleDelete(id: string) {
    await store.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <AppLayout>
      <TILInput onSubmit={handleAdd} />
      <TILFeed entries={entries} onDelete={handleDelete} />
    </AppLayout>
  );
}

export default App;
