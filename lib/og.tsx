import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/**
 * Shared Open Graph card: split teal / chilli-red panels with the page title.
 * Rendered at build time by next/og (no external fonts needed).
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
  tone = "split",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: "split" | "tokbah" | "makchic";
}) {
  const left = tone === "makchic" ? "#D9372A" : "#0F3D3E";
  const right = tone === "tokbah" ? "#1F4D36" : "#D9372A";
  const accent = tone === "makchic" ? "#F5B325" : "#B8893B";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(100deg, ${left} 0%, ${left} 52%, ${right} 52%, ${right} 100%)`,
          color: "#FAF7F0",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: `2px solid ${accent}`,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", width: "100%" }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: accent, textTransform: "uppercase", fontFamily: "sans-serif" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 88, lineHeight: 1.02, marginTop: 24, maxWidth: 980, fontStyle: "italic" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 32, marginTop: 28, opacity: 0.85, fontFamily: "sans-serif" }}>{subtitle}</div>}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 48, fontSize: 30, fontFamily: "sans-serif" }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, border: `3px solid ${accent}`, display: "flex" }} />
            RJS Foods
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
