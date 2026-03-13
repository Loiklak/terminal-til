import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout.tsx";
import { TILInput } from "@/components/til-input.tsx";
import { TILFeed } from "@/components/til-feed.tsx";
import { useStore } from "@/lib/store/context.tsx";
import type { TIL } from "@/lib/store/interface.ts";
import { getAnimation, type AnimationMode } from "@/lib/animation.ts";
import { getTheme, type Scheme } from "@/lib/theme.ts";
import { triggerCelebration } from "@/lib/haptics.ts";

function App() {
  const store = useStore();
  const [entries, setEntries] = useState<TIL[]>([]);
  const [animationMode, setAnimationMode] = useState<AnimationMode>(getAnimation);
  const [theme, setTheme] = useState<Scheme>(getTheme);
  const [newEntryId, setNewEntryId] = useState<string>();

  useEffect(() => {
    store.getAll().then(setEntries);
  }, [store]);

  async function handleAdd(content: string, title?: string) {
    triggerCelebration(animationMode);

    const entry = await store.add(content, title);
    setEntries((prev) => [entry, ...prev]);

    if (animationMode !== "none") {
      setNewEntryId(entry.id);
    }
  }

  async function handleDelete(id: string) {
    await store.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <AppLayout
      animationMode={animationMode}
      onAnimationChange={setAnimationMode}
      theme={theme}
      onThemeChange={setTheme}
    >
      <TILInput onSubmit={handleAdd} animationMode={animationMode} />
      <TILFeed entries={entries} onDelete={handleDelete} newEntryId={newEntryId} />
    </AppLayout>
  );
}

export default App;
