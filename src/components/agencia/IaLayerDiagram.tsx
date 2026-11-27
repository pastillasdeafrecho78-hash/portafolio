"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon, type OnboardingIconId } from "@/components/onboarding/OnboardingIcons";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";
import styles from "./IaLayerDiagram.module.css";

type Sat = {
  title: string;
  body: string;
  icon: OnboardingIconId;
};

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

  useEffect(() => {
    const root = rootRef.current;
    const hub = root?.querySelector<HTMLElement>(".ia-layer__cell--hub");
    if (!root || !hub) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".ia-layer__cell--sat"));
    const spokes = root.querySelectorAll<SVGLineElement>(".ia-layer__spoke");

    const draw = () => {
      const origin = root.getBoundingClientRect();
      const center = hub.getBoundingClientRect();
      const hubX = center.left + center.width / 2;
      const hubY = center.top + center.height / 2;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - hubX;
        const dy = rect.top + rect.height / 2 - hubY;
        const distance = Math.hypot(dx, dy);
        if (!distance || !rect.width) return;

        const ux = dx / distance;
        const uy = dy / distance;
        const start = Math.min(
          center.width / 2 / Math.abs(ux),
          center.height / 2 / Math.abs(uy),
        ) + 2;
        const end = Math.max(start, distance - Math.min(
          rect.width / 2 / Math.abs(ux),
          rect.height / 2 / Math.abs(uy),
        ) - 2);
        const line = spokes[index];
        line.setAttribute("x1", String(hubX - origin.left + ux * start));
        line.setAttribute("y1", String(hubY - origin.top + uy * start));
        line.setAttribute("x2", String(hubX - origin.left + ux * end));
        line.setAttribute("y2", String(hubY - origin.top + uy * end));
      });
    };

    const observer = new ResizeObserver(draw);
    [root, hub, ...cards].forEach((element) => observer.observe(element));
    draw();
    return () => observer.disconnect();
  }, [satellites]);

  return (
    <div ref={rootRef} className="ia-layer" aria-label="Capa de IA transversal">
      <svg className="ia-layer__spokes" aria-hidden="true">
        {satellites.map((sat) => <line key={sat.title} className="ia-layer__spoke" />)}
      </svg>
      <div className="ia-layer__grid">
        <div className="ia-layer__cell--hub">
          <div className={`ia-layer__hub ${styles.hub}`}>IA</div>
        </div>
        {satellites.map((sat) => (
          <div key={sat.title} className="ia-layer__cell--sat">
            <SatCard sat={sat} />
          </div>
        ))}
      </div>
    </div>
  );
}
