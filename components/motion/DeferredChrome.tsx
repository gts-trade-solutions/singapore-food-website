"use client";

import dynamic from "next/dynamic";

/*
 * Site-wide extras that are never needed for first paint. Loading them as separate
 * chunks after hydration keeps the initial JavaScript (and Total Blocking Time) down.
 */
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const FlyToCartLayer = dynamic(() => import("./FlyToCart").then((m) => m.FlyToCartLayer), { ssr: false });
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });
const ScrollVines = dynamic(() => import("@/components/illustrations/Batik").then((m) => m.ScrollVines), { ssr: false });

export function DeferredChrome() {
  return (
    <>
      <ScrollVines />
      <CartDrawer />
      <FlyToCartLayer />
      <Cursor />
    </>
  );
}
