import type { TIL } from "@/lib/store/interface.ts";

interface TILEntryProps {
  entry: TIL;
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TILEntry({ entry }: TILEntryProps) {
  return (
    <div className="py-2 pl-2">
      <div className="flex gap-2">
        <span className="text-primary font-bold shrink-0">&gt;</span>
        <div className="min-w-0">
          {entry.title && <p className="font-bold text-foreground">{entry.title}</p>}
          <p className="text-foreground text-sm">{entry.content}</p>
          <span className="text-xs text-muted-foreground">{formatTime(entry.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
