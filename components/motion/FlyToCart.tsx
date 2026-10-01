"use client";

import { motion } from "framer-motion";
import { CART_TARGET_ID, useUI, type Flyer } from "@/lib/ui-store";
import { isVector } from "@/lib/utils";
import Image from "next/image";

function FlyingThumb({ flyer }: { flyer: Flyer }) {
  const land = useUI((s) => s.landFlyer);
  const target = typeof document !== "undefined" ? document.getElementById(CART_TARGET_ID) : null;
  const t = target?.getBoundingClientRect();
  const size = 72;
  const startX = flyer.from.x + flyer.from.width / 2 - size / 2;
  const startY = flyer.from.y + flyer.from.height / 2 - size / 2;
  const endX = t ? t.left + t.width / 2 - size / 2 : window.innerWidth - 60;
  const endY = t ? t.top + t.height / 2 - size / 2 : 20;
  const startScale = Math.min(2.4, Math.max(1, flyer.from.width / size));

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[96] h-[72px] w-[72px] overflow-hidden rounded-2xl bg-surface shadow-lift"
      initial={{ x: startX, y: startY, scale: startScale, opacity: 0.95, rotate: 0 }}
      animate={{
        x: [startX, (startX + endX) / 2, endX],
        y: [startY, Math.min(startY, endY) - 120, endY],
        scale: [startScale, 0.9, 0.25],
        rotate: [0, -12, 8],
        opacity: [0.95, 1, 0.4],
      }}
      transition={{ duration: 0.85, ease: [0.55, 0, 0.35, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={() => land(flyer.id)}
    >
      <Image src={flyer.src} alt="" fill sizes="72px" className="object-contain p-1" unoptimized={isVector(flyer.src)} />
    </motion.div>
  );
}

/** Renders thumbnails flying from "Add to basket" buttons to the cart icon. */
export function FlyToCartLayer() {
  const flyers = useUI((s) => s.flyers);
  return (
    <div aria-hidden="true">
      {flyers.map((f) => (
        <FlyingThumb key={f.id} flyer={f} />
      ))}
    </div>
  );
}
