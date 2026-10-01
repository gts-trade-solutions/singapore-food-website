"use client";

import { AnimatePresence, motion } from "framer-motion";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

export function QuantitySelector({ value, onChange, min = 1, max = 99, size = "md", label, className }: Props) {
  const btn = cn(
    "grid place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-40",
    size === "md" ? "h-11 w-11" : "h-9 w-9",
  );
  return (
    <div
      role="group"
      aria-label={label ?? t.cart.quantity}
      className={cn("inline-flex items-center rounded-full border border-line bg-bg", className)}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t.cart.decrease}>
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className={cn("relative overflow-hidden text-center font-semibold tabular-nums", size === "md" ? "w-8" : "w-6 text-sm")}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {t.cart.quantity} {value}
        </span>
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.cart.increase}>
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
