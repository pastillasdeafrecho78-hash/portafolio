import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-xs text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
