import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Ornamental certification badges. Renders nothing unless
 * NEXT_PUBLIC_SHOW_CERTIFICATIONS=true (see lib/config.ts).
 */
export function CertificationBadges({ className }: { className?: string }) {
  if (!siteConfig.showCertifications) return null;
  return (
    <ul className={cn("flex flex-wrap gap-3", className)} aria-label="Certifications">
      {siteConfig.certifications.map((c) => (
        <li
          key={c.id}
          className="relative inline-flex items-center gap-2 rounded-full border border-accent px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase"
          title={c.detail}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M10 1.5 12.2 4l3.3-.4.4 3.3L18.5 9l-2 2.6.4 3.3-3.3.4L12.2 18 10 16.5 7.8 18l-1.4-2.7-3.3-.4.4-3.3-2-2.6 2.6-2.1.4-3.3 3.3.4z" />
            <path d="m6.8 10 2.2 2.2 4.2-4.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.label}
        </li>
      ))}
    </ul>
  );
}
