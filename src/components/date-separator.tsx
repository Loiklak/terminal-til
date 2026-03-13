interface DateSeparatorProps {
  label: string;
}

export function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground font-mono">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
