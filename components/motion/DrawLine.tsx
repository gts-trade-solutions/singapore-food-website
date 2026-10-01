"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Ornamental gold divider that draws itself in from the centre. */
export function DrawLine({ className, color = "var(--tb-gold)" }: { className?: string; color?: string }) {
  return (
    <svg
      className={cn("h-6 w-full max-w-md", className)}
      viewBox="0 0 400 24"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {[
        "M190 12 H10",
        "M210 12 H390",
      ].map((d) => (
        <motion.path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={1.2}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <motion.path
        d="M200 3 L209 12 L200 21 L191 12 Z"
        stroke={color}
        strokeWidth={1.2}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
        style={{ transformOrigin: "200px 12px" }}
      />
      <motion.circle
        cx="200"
        cy="12"
        r="2.5"
        fill={color}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
      />
    </svg>
  );
}
