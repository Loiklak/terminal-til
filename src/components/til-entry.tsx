import type { TIL } from "@/lib/store/interface.ts";

interface TILEntryProps {
  entry: TIL;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TILEntry({ entry, onDelete, isNew }: TILEntryProps) {
  return (
    <div className={`group py-2 pl-2 ${isNew ? "animate-entry-in" : ""}`}>
      <div className="flex gap-2">
        <span className="text-primary font-bold shrink-0">&gt;</span>
        <div className="min-w-0 flex-1">
          {entry.title && <p className="font-bold text-foreground">{entry.title}</p>}
          <p className="text-foreground text-sm whitespace-pre-wrap">{entry.content}</p>
          <span className="text-xs text-muted-foreground">{formatTime(entry.createdAt)}</span>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="shrink-0 self-start text-muted-foreground/0 group-hover:text-muted-foreground hover:text-destructive transition-colors text-sm px-1"
          aria-label="Delete"
        >
          x
        </button>
      </div>
    </div>
  );
}
