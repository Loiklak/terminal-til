import type { TIL } from "@/lib/store/interface.ts";
import { DateSeparator } from "./date-separator.tsx";
import { TILEntry } from "./til-entry.tsx";

interface TILFeedProps {
  entries: TIL[];
  onDelete: (id: string) => void;
}

function getDateLabel(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const entryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (entryDay.getTime() === today.getTime()) return "today";
  if (entryDay.getTime() === yesterday.getTime()) return "yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function groupByDate(entries: TIL[]): Map<string, TIL[]> {
  const groups = new Map<string, TIL[]>();
  for (const entry of entries) {
    const label = getDateLabel(entry.createdAt);
    const group = groups.get(label);
    if (group) {
      group.push(entry);
    } else {
      groups.set(label, [entry]);
    }
  }
  return groups;
}

export function TILFeed({ entries, onDelete }: TILFeedProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm py-12">
        no learnings yet. type something above.
      </p>
    );
  }

  const groups = groupByDate(entries);

  return (
    <div>
      {Array.from(groups.entries()).map(([label, items]) => (
        <div key={label}>
          <DateSeparator label={label} />
          {items.map((entry) => (
            <TILEntry key={entry.id} entry={entry} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  );
}
