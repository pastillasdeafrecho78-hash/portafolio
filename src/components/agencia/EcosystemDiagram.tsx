"use client";

import { useEffect, useRef, useState } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { OnboardingIcon, type OnboardingIconId } from "@/components/onboarding/OnboardingIcons";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Node = {
  id: string;
  label: string;
  delivers: string;
  icon: OnboardingIconId;
};

export function EcosystemDiagram({ nodes }: { nodes: readonly Node[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tokenRef = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const token = tokenRef.current;
    if (!root || !path || !token) return;

    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = reduced ? "0" : `${length}`;

    if (reduced) {
      gsap.set(token, { opacity: 1 });
      return;
    }

    gsap.set(token, { opacity: 0 });

    const draw = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: root, start: "top 75%", once: true },
      onComplete: () => {
        gsap.set(token, { opacity: 1 });
        gsap.to(token, {
          duration: 3.2,
          repeat: -1,
          ease: "none",
          onUpdate: function onUpdate() {
            const p = this.progress();
            const pt = path.getPointAtLength(p * length);
            token.setAttribute("cx", String(pt.x));
            token.setAttribute("cy", String(pt.y));
          },
        });
      },
    });

    return () => {
      draw.scrollTrigger?.kill();
      draw.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [nodes]);

  return (
    <div ref={rootRef} className="eco-diagram">
      <svg className="eco-diagram__svg" viewBox="0 0 640 220" aria-hidden>
        <path
          ref={pathRef}
          className="eco-diagram__path"
          d="M 90 110 C 200 40, 280 40, 320 110 C 360 180, 440 180, 550 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle ref={tokenRef} className="eco-diagram__token" r="6" cx="90" cy="110" />
      </svg>

      <div className="eco-diagram__nodes">
        {nodes.map((node, i) => (
          <button
            key={node.id}
            type="button"
            className={`eco-diagram__node ${active === i ? "is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <GlassSurface preset="panel" className="eco-diagram__card">
              <span className="eco-diagram__icon">
                <OnboardingIcon id={node.icon} className="eco-diagram__svg-icon" />
              </span>
              <strong>{node.label}</strong>
              <small className={active === i ? "is-show" : ""}>{node.delivers}</small>
            </GlassSurface>
          </button>
        ))}
      </div>
    </div>
  );
}
