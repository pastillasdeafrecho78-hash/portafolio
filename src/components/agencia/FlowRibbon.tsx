"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Step = { id: string; label: string };

export function FlowRibbon({ steps }: { steps: readonly Step[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    if (!root || !dot) return;

    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    const line = root.querySelector<HTMLElement>(".flow-ribbon__line-fill");

    if (reduced) {
      if (line) line.style.width = "100%";
      gsap.set(dot, { left: "100%" });
      return;
    }

    if (line) gsap.set(line, { width: "0%" });
    gsap.set(dot, { left: "0%" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });
    tl.to(line, { width: "100%", duration: 1.6, ease: "power2.inOut" }, 0).to(
      dot,
      { left: "100%", duration: 1.6, ease: "power2.inOut" },
      0,
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
    <div ref={rootRef} className="flow-ribbon" aria-label="Flujo de extremo a extremo">
      <div className="flow-ribbon__line" aria-hidden>
        <span className="flow-ribbon__line-fill" />
        <span ref={dotRef} className="flow-ribbon__dot" />
      </div>
      <ol className="flow-ribbon__steps">
        {steps.map((step) => (
          <li key={step.id}>
            <span className="flow-ribbon__node" aria-hidden />
            <strong>{step.label}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
