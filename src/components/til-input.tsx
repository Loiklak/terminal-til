import { useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";

interface TILInputProps {
  onSubmit: (content: string, title?: string) => void;
}

export function TILInput({ onSubmit }: TILInputProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed) return;

    const trimmedTitle = title.trim() || undefined;
    onSubmit(trimmed, trimmedTitle);
    setTitle("");
    setContent("");
  }

  return (
    <div className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            contentRef.current?.focus();
          }
        }}
        placeholder="title (optional)"
        className="h-7 border-none bg-transparent px-2 text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-none"
      />
      <div className="relative flex items-center">
        <span className="absolute left-2.5 text-primary font-bold text-sm pointer-events-none select-none">
          $
        </span>
        <Input
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="what did you learn today?"
          autoFocus
          className="pl-7"
        />
      </div>
    </div>
  );
}
