"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon, type OnboardingIconId } from "@/components/onboarding/OnboardingIcons";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Sat = {
  title: string;
  body: string;
  icon: OnboardingIconId;
};

/** Cross layout: top, right, bottom, left — matches satellites order in data. */
const SLOT: Array<"top" | "right" | "bottom" | "left"> = ["top", "right", "bottom", "left"];

function SatCard({ sat }: { sat: Sat }) {
  return (
    <GlassSurface as="article" preset="panel" className="ia-layer__sat">
      <span className="ia-layer__icon">
        <OnboardingIcon id={sat.icon} className="ia-layer__svg-icon" />
      </span>
      <strong>{sat.title}</strong>
      <small>{sat.body}</small>
    </GlassSurface>
  );
}

export function IaLayerDiagram({ satellites }: { satellites: readonly Sat[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap, ScrollTrigger } = getGsap();
    const sats = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".ia-layer__sat"));
    const hub = root.querySelector<HTMLElement>(".ia-layer__hub");
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([sats, hub], { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(sats, { opacity: 0, scale: 0.92 });
    gsap.set(hub, { opacity: 0, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 75%", once: true },
    });
    tl.to(hub, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }).to(
      sats,
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.2",
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [satellites]);

  const bySlot = Object.fromEntries(
    SLOT.map((slot, i) => [slot, satellites[i]]).filter(([, sat]) => Boolean(sat)),
  ) as Record<(typeof SLOT)[number], Sat>;

  return (
    <div ref={rootRef} className="ia-layer" aria-label="Capa de IA transversal">
      <div className="ia-layer__grid">
        <div className="ia-layer__cell ia-layer__cell--top">
          {bySlot.top ? <SatCard sat={bySlot.top} /> : null}
        </div>
        <div className="ia-layer__cell ia-layer__cell--left">
          {bySlot.left ? <SatCard sat={bySlot.left} /> : null}
        </div>
        <div className="ia-layer__cell ia-layer__cell--hub">
          <div className="ia-layer__spokes" aria-hidden>
            <span className="ia-layer__spoke ia-layer__spoke--v" />
            <span className="ia-layer__spoke ia-layer__spoke--h" />
          </div>
          <GlassSurface preset="panel" className="ia-layer__hub">
            <span>IA</span>
            <small>capa común</small>
          </GlassSurface>
        </div>
        <div className="ia-layer__cell ia-layer__cell--right">
          {bySlot.right ? <SatCard sat={bySlot.right} /> : null}
        </div>
        <div className="ia-layer__cell ia-layer__cell--bottom">
          {bySlot.bottom ? <SatCard sat={bySlot.bottom} /> : null}
        </div>
      </div>
    </div>
  );
}
