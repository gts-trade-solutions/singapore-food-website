import { spiceLabels, type SpiceLevel } from "@/data/products";
import { cn } from "@/lib/utils";

export function SpiceMeter({ level, className, showLabel = true }: { level: SpiceLevel; className?: string; showLabel?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <svg key={i} viewBox="0 0 16 24" className={cn("h-4 w-3", i <= level ? "text-mc-red" : "text-ink/20")}>
            <path d="M8 4 C14 6 13 16 8 23 C5 19 3 13 4 9 C5 6 6 4 8 4Z" fill="currentColor" />
            <path d="M8 5 C8 3 9 1 11 1" stroke="#2E7D32" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        ))}
      </span>
      <span className={showLabel ? undefined : "sr-only"}>{spiceLabels[level]}</span>
    </span>
  );
}
