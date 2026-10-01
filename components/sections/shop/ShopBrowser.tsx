"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { brands, type BrandSlug } from "@/data/brands";
import { productTypeLabels, spiceLabels, type Product, type ProductType, type SpiceLevel } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { GridFiller, fillerSpan, gridClasses, gridSizes, useGridColumns } from "@/components/sections/ProductGrid";

type Option<T extends string> = { value: T | "all"; label: string };

const BRAND_OPTIONS: Option<BrandSlug>[] = [
  { value: "all", label: "All brands" },
  { value: "tok-bah", label: brands["tok-bah"].name },
  { value: "mak-chic", label: brands["mak-chic"].shortName },
];

const TYPE_OPTIONS: Option<ProductType>[] = [
  { value: "all", label: "All types" },
  ...(Object.keys(productTypeLabels) as ProductType[]).map((t) => ({ value: t, label: productTypeLabels[t] })),
];

const SPICE_OPTIONS: Option<`${SpiceLevel}`>[] = [
  { value: "all", label: "Any" },
  ...([0, 1, 2, 3] as SpiceLevel[]).map((s) => ({ value: `${s}` as `${SpiceLevel}`, label: spiceLabels[s] })),
];

function FilterGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value === opt.value;
          const id = `${name}-${opt.value}`;
          return (
            <div key={opt.value} className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors duration-300 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brand-focus)]",
                  checked ? "border-transparent text-ivory" : "border-line text-ink hover:border-ink/40",
                )}
              >
                {checked && (
                  <motion.span
                    layoutId={`pill-${name}`}
                    className="absolute inset-0 rounded-full bg-charcoal"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

type Filters = { brand: string; type: string; spice: string };
const ALL: Filters = { brand: "all", type: "all", spice: "all" };

function readFilters(params: URLSearchParams): Filters {
  return {
    brand: params.get("brand") ?? "all",
    type: params.get("type") ?? "all",
    spice: params.get("spice") ?? "all",
  };
}

function filtersToQuery(f: Filters): string {
  const q = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => f[k] !== "all" && q.set(k, f[k]));
  return q.toString();
}

const sameFilters = (a: Filters, b: Filters) => a.brand === b.brand && a.type === b.type && a.spice === b.spice;

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const paramsKey = params.toString();

  // Filters live in state (updated instantly, so quick successive clicks never overwrite
  // each other) and the URL mirrors them, so filtered views stay shareable.
  const [filters, setFilters] = useState<Filters>(() => readFilters(params));
  const { brand, type, spice } = filters;
  // Queries we wrote ourselves; when the URL catches up to one of them it is not an outside change.
  const written = useRef<Set<string>>(new Set());

  // URL changed from outside (Back/Forward, a shared link): adopt it.
  useEffect(() => {
    if (written.current.has(paramsKey)) {
      written.current.delete(paramsKey);
      return;
    }
    setFilters((current) => {
      const fromUrl = readFilters(new URLSearchParams(paramsKey));
      return sameFilters(current, fromUrl) ? current : fromUrl;
    });
  }, [paramsKey]);

  // State changed: write it to the URL (without adding history entries or scrolling).
  useEffect(() => {
    const qs = filtersToQuery(filters);
    if (qs === paramsKey) return;
    written.current.add(qs);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // paramsKey is read only to avoid a redundant replace; reacting to it here would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pathname, router]);

  const setParam = (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (brand === "all" || p.brand === brand) &&
          (type === "all" || p.type === type) &&
          (spice === "all" || `${p.spiceLevel}` === spice),
      ),
    [products, brand, type, spice],
  );

  const hasFilters = brand !== "all" || type !== "all" || spice !== "all";
  const cols = useGridColumns("wide");
  const span = fillerSpan(filtered.length, cols);

  return (
    <div className="container-page">
      <LayoutGroup>
        <div className="mb-6 grid gap-6 rounded-card border border-line bg-surface/60 p-6 md:p-8 lg:grid-cols-[auto_1fr_auto]">
          <FilterGroup legend="Brand" name="brand" options={BRAND_OPTIONS} value={brand} onChange={(v) => setParam("brand", v)} />
          <FilterGroup legend="Type" name="type" options={TYPE_OPTIONS} value={type} onChange={(v) => setParam("type", v)} />
          <FilterGroup legend="Spice level" name="spice" options={SPICE_OPTIONS} value={spice} onChange={(v) => setParam("spice", v)} />
        </div>
      </LayoutGroup>

      <h2 className="sr-only">Products</h2>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-muted">
          Showing <strong className="text-ink">{filtered.length}</strong> of {products.length} products
        </p>
        {hasFilters && (
          <button type="button" onClick={() => setFilters(ALL)} className="min-h-11 text-sm font-semibold underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>

      <motion.ul layout className={gridClasses.wide}>
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ProductCard product={p} index={i} tilted={p.brand === "mak-chic"} priority={i < 4} sizes={gridSizes.wide} />
            </motion.li>
          ))}
        </AnimatePresence>
        {span > 0 && (
          <GridFiller key={`filler-${span}`} span={span} showcase={products.filter((p) => !filtered.includes(p)).concat(filtered).slice(0, 3)} />
        )}
      </motion.ul>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
          <p className="font-display text-3xl">Nothing matches that combination.</p>
          <p className="mt-2 text-muted">Try a different spice level or brand.</p>
        </motion.div>
      )}
    </div>
  );
}
