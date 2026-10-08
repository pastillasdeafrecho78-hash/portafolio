"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Step = { title: string; body: string };

export function MethodPath({ steps }: { steps: readonly Step[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = reduced ? "0" : `${length}`;

    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".method-path__card"));

    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 18 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });
    tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" }).to(
      cards,
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
      "-=1",
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [steps]);

  return (
    <div ref={rootRef} className="method-path">
      <svg className="method-path__svg" viewBox="0 0 900 80" aria-hidden preserveAspectRatio="none">
        <path
          ref={pathRef}
          className="method-path__line"
          d="M 20 40 H 880"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <ol className="method-path__steps">
        {steps.map((step, i) => (
          <li key={step.title}>
            <GlassSurface as="article" preset="panel" className="method-path__card">
              <span className="method-path__n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </GlassSurface>
          </li>
        ))}
      </ol>
    </div>
  );
}
