import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle bg-bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
