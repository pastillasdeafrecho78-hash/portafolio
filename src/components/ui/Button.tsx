import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "whatsapp";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-cta text-bg-base hover:bg-white border border-transparent",
  secondary:
    "bg-transparent text-text-primary border border-border-subtle hover:border-border-hover",
  whatsapp:
    "bg-accent-whatsapp text-white border border-transparent hover:brightness-110",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
