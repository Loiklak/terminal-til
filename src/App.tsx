import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout.tsx"
import { TILInput } from "@/components/til-input.tsx"
import { TILFeed } from "@/components/til-feed.tsx"
import { localStorageStore } from "@/lib/store/local-storage.ts"
import type { TIL } from "@/lib/store/interface.ts"

const store = localStorageStore

function App() {
  const [entries, setEntries] = useState<TIL[]>([])

  useEffect(() => {
    store.getAll().then(setEntries)
  }, [])

  async function handleAdd(content: string, title?: string) {
    const entry = await store.add(content, title)
    setEntries((prev) => [entry, ...prev])
  }

  return (
    <AppLayout>
      <TILInput onSubmit={handleAdd} />
      <TILFeed entries={entries} />
    </AppLayout>
  )
}

export default App
