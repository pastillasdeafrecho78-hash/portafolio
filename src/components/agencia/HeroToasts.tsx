"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon, type OnboardingIconId } from "@/components/onboarding/OnboardingIcons";
import { getGsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/agencia-motion";

type Toast = {
  title: string;
  meta: string;
  icon: OnboardingIconId;
};

export function HeroToasts({ items }: { items: readonly Toast[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = getGsap();
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-toast"));
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 36, scale: 0.96 });
    const intro = gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.45,
    });

    const floats = cards.map((card, i) =>
      gsap.to(card, {
        y: "-=6",
        duration: 2.4 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2 + i * 0.12,
      }),
    );

    let onMove: ((e: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;

    if (isFinePointer()) {
      onMove = (e: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        cards.forEach((card, i) => {
          const depth = (i + 1) * 4;
          gsap.to(card, {
            x: nx * depth,
            rotateZ: nx * 1.2,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
          void ny;
        });
      };
      onLeave = () => {
        gsap.to(cards, { x: 0, rotateZ: 0, duration: 0.5, ease: "power2.out" });
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
    }

    return () => {
      intro.kill();
      floats.forEach((t) => t.kill());
      gsap.set(cards, { clearProps: "all", opacity: 1 });
      if (onMove) root.removeEventListener("pointermove", onMove);
      if (onLeave) root.removeEventListener("pointerleave", onLeave);
    };
  }, [items]);

  return (
    <div ref={rootRef} className="agencia-toasts is-motion" aria-hidden>
      {items.map((item, i) => (
        <GlassSurface
          key={item.title}
          preset="panel"
          className={`agencia-toast agencia-toast--${i + 1}`}
        >
          <span className="agencia-toast__icon">
            <OnboardingIcon id={item.icon} className="agencia-toast__svg" />
          </span>
          <span className="agencia-toast__body">
            <strong>{item.title}</strong>
            <small>{item.meta}</small>
          </span>
        </GlassSurface>
      ))}
    </div>
  );
}
