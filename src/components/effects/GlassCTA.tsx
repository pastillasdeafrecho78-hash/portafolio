"use client";

import type { ElementType, ReactNode } from "react";
import { useAppleGlass, type GlassPreset } from "@/hooks/useAppleGlass";

type Props = {
  children: ReactNode;
  href: string;
  external?: boolean;
  size?: "default" | "small";
};

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "amber";
  size?: "default" | "small";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

/** Misma pastilla liquid glass que los CTAs, como `<button>`. */
export function GlassButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled,
  type = "button",
}: ButtonProps) {
  const ref = useAppleGlass<HTMLButtonElement>({
    preset: "cta",
    shape: "pill",
    tone: variant === "amber" ? "amber" : "default",
  });

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`glass-cta ${size === "small" ? "glass-cta--sm" : ""} ${
        variant === "amber" ? "glass-cta--amber" : ""
      } ${className}`.trim()}
    >
      <span className="glass-cta-label">{children}</span>
    </button>
  );
}

export function GlassCTA({ children, href, external, size = "default" }: Props) {
  const ref = useAppleGlass<HTMLAnchorElement>({
    preset: "cta",
    shape: "pill",
  });

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`glass-cta ${size === "small" ? "glass-cta--sm" : ""}`}
    >
      <span className="glass-cta-label">{children}</span>
    </a>
  );
}

type SurfaceProps = {
  children: ReactNode;
  preset?: GlassPreset;
  className?: string;
  as?: "div" | "article";
};

/** Glass panel for translucent content blocks (offers, channels). */
export function GlassSurface({
  children,
  preset = "panel",
  className = "",
  as = "div",
}: SurfaceProps) {
  const Tag = as as ElementType;
  const ref = useAppleGlass<HTMLElement>({ preset, followLight: true });

  return (
    <Tag ref={ref} className={`glass-surface ${className}`.trim()}>
      {children}
    </Tag>
  );
}
