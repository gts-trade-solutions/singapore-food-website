"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { brandForPath } from "@/lib/brand";
import { useUI } from "@/lib/ui-store";

/**
 * Keeps <html data-brand> in sync with the current route, or with the brand
 * the visitor is previewing in the home hero. Pages also set data-brand on their
 * own root so the first server render is already themed.
 */
export function BrandTheme() {
  const pathname = usePathname();
  const preview = useUI((s) => s.previewBrand);
  const setPreview = useUI((s) => s.setPreviewBrand);

  useEffect(() => {
    setPreview(null);
  }, [pathname, setPreview]);

  useEffect(() => {
    document.documentElement.dataset.brand = preview ?? brandForPath(pathname);
  }, [pathname, preview]);

  return null;
}
