import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/motion/PageTransition";

type Variant = "primary" | "outline" | "ghost" | "accent";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-button font-semibold whitespace-nowrap transition-[transform,opacity] duration-300 ease-brand select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink",
  accent: "bg-accent text-accent-ink",
  outline: "border-2 border-current text-ink",
  ghost: "text-ink underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

/** Hover fill that slides up from below (transform only). */
function Fill({ variant }: { variant: Variant }) {
  if (variant === "ghost") return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-brand group-hover/btn:translate-y-0",
        variant === "outline" ? "bg-ink" : "bg-ink/15",
      )}
    />
  );
}

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      <Fill variant={variant} />
      <span
        className={cn(
          "relative inline-flex items-center gap-2",
          variant === "outline" && "transition-colors duration-300 group-hover/btn:text-bg",
        )}
      >
        {children}
      </span>
    </>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof TransitionLink>, "children"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className, children, ...rest }: ButtonLinkProps) {
  return (
    <TransitionLink className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </TransitionLink>
  );
}

export function ExternalButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} target="_blank" rel="noopener noreferrer" {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </a>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.96-3.48-.23-.36a9.42 9.42 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.46-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.77 6.68c0 5.21-4.24 9.44-9.46 9.44zm8.05-17.5A11.32 11.32 0 0 0 12.05.66C5.77.66.66 5.77.66 12.05c0 2 .52 3.96 1.52 5.69L.57 23.6l6-1.57a11.36 11.36 0 0 0 5.47 1.4h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.34-8.05z" />
    </svg>
  );
}
