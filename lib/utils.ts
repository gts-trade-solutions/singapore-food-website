export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** next/image cannot optimise SVG by default; serve vector placeholders as-is. */
export function isVector(src: string): boolean {
  return src.toLowerCase().endsWith(".svg");
}
