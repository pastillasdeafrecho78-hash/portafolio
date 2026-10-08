"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon, type OnboardingIconId } from "@/components/onboarding/OnboardingIcons";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Stage = {
  id: string;
  label: string;
  icon: OnboardingIconId;
};

export function AgentPipeline({ stages }: { stages: readonly Stage[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const chip = chipRef.current;
    if (!root || !chip) return;

    const { gsap, ScrollTrigger } = getGsap();
    const steps = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agent-pipe__step"));
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(steps, { opacity: 1 });
      gsap.set(chip, { opacity: 1, left: "88%" });
      return;
    }

    gsap.set(steps, { opacity: 0.35, scale: 0.96 });
    gsap.set(chip, { opacity: 0, left: "2%" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 75%", once: true },
    });

    // Pace so each stage is readable (~1.25s move + brief hold).
    steps.forEach((step, i) => {
      const pct = (i / Math.max(stages.length - 1, 1)) * 88 + 2;
      const at = i * 1.55;
      tl.to(chip, { opacity: 1, left: `${pct}%`, duration: 1.25, ease: "power2.inOut" }, at);
      tl.to(step, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, at + 0.2);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [stages]);

  return (
    <div ref={rootRef} className="agent-pipe">
      <div className="agent-pipe__track" aria-hidden>
        <div ref={chipRef} className="agent-pipe__chip">
          Lead
        </div>
      </div>
      <ol className="agent-pipe__steps">
        {stages.map((stage) => (
          <li key={stage.id}>
            <GlassSurface as="article" preset="panel" className="agent-pipe__step">
              <span className="agent-pipe__icon">
                <OnboardingIcon id={stage.icon} className="agent-pipe__svg" />
              </span>
              <strong>{stage.label}</strong>
            </GlassSurface>
          </li>
        ))}
      </ol>
    </div>
  );
}
