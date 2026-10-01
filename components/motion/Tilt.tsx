"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { usePointerFine, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  /** Optional glare highlight following the pointer. */
  glare?: boolean;
};

/** 3D hover tilt driven by pointer position. Desktop only, off for reduced motion. */
export function Tilt({ children, className, max = 10, glare = true }: TiltProps) {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const active = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, [0, 1], ["-30%", "30%"]);
  const glareY = useTransform(py, [0, 1], ["-30%", "30%"]);
  const glareOpacity = useSpring(0, spring);

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={active ? { rotateX, rotateY } : undefined}
        onPointerMove={(e) => {
          if (!active) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
          glareOpacity.set(1);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
          glareOpacity.set(0);
        }}
      >
        {children}
        {glare && active && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            style={{ opacity: glareOpacity }}
          >
            <motion.div
              className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.35),transparent_45%)]"
              style={{ x: glareX, y: glareY }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
