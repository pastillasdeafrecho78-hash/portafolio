"use client";

import type { CSSProperties, ReactNode } from "react";
import { useAppleGlass } from "@/hooks/useAppleGlass";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcons";
import type { OnboardingIconKey } from "@/lib/constants";

type Props = {
  children: ReactNode;
  onClick: () => void;
  hint?: string;
  icon?: OnboardingIconKey;
  className?: string;
  style?: CSSProperties;
};

/** Clickable frosted glass option for onboarding steps. */
export function GlassOption({
  children,
  onClick,
  hint,
  icon,
  className = "",
  style,
}: Props) {
  const ref = useAppleGlass<HTMLButtonElement>({
    preset: "cta",
    shape: "pill",
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`glass-option ${className}`.trim()}
      style={style}
      onClick={onClick}
    >
      <span className="glass-option__inner">
        {icon ? (
          <span className="glass-option__icon" aria-hidden>
            <OnboardingIcon id={icon} />
          </span>
        ) : null}
        <span className="glass-option__label">{children}</span>
      </span>
      {hint ? <span className="glass-option__hint">{hint}</span> : null}
    </button>
  );
}
