import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { ConfettiBurst } from "./confetti-burst.tsx";
import type { AnimationMode } from "@/lib/animation.ts";

const FLASH_DURATION = 1400;

interface TILInputProps {
  onSubmit: (content: string, title?: string) => void;
  animationMode: AnimationMode;
}

export function TILInput({ onSubmit, animationMode }: TILInputProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [flashing, setFlashing] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flashing) return;
    const timer = setTimeout(() => setFlashing(false), FLASH_DURATION);
    return () => clearTimeout(timer);
  }, [flashing]);

  function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed) return;

    const trimmedTitle = title.trim() || undefined;
    onSubmit(trimmed, trimmedTitle);
    setTitle("");
    setContent("");

    if (animationMode === "terminal") {
      setFlashing(true);
    } else if (animationMode === "confetti") {
      setConfettiActive(true);
    }
  }

  const handleConfettiComplete = useCallback(() => {
    setConfettiActive(false);
  }, []);

  return (
    <>
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
        <div
          ref={inputWrapperRef}
          className={`relative flex items-start rounded-md ${flashing ? "animate-terminal-flash" : ""}`}
        >
          <span className="absolute left-2.5 top-0 h-full flex items-center pointer-events-none select-none">
            <span
              className={`animate-prompt-pulse relative font-bold text-sm transition-all duration-300 ${flashing ? "scale-0 opacity-0 text-primary" : "scale-100 opacity-100 text-primary"}`}
            >
              $
            </span>
            <span
              className={`animate-prompt-pulse absolute inset-0 flex items-center justify-center font-bold text-sm transition-all duration-300 ${flashing ? "scale-125 opacity-100 text-success" : "scale-0 opacity-0 text-success"}`}
            >
              {"\u2713"}
            </span>
          </span>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="what did you learn today?"
            autoFocus
            rows={1}
            className="w-full pl-7 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring resize-none"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
        </div>
      </div>
      <ConfettiBurst
        active={confettiActive}
        onComplete={handleConfettiComplete}
        anchorRef={inputWrapperRef}
      />
    </>
  );
}
