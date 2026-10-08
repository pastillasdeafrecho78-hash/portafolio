"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Step = { title: string; body: string };

export function AgenciaMethod({ steps }: { steps: readonly Step[] }) {
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = getGsap();
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-method__card"));
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 22, scale: 0.96 });

    const tween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        once: true,
      },
      onComplete: () => {
        cards.forEach((card, i) => {
          gsap.delayedCall(i * 0.08, () => {
            card.classList.add("is-pulse");
            gsap.delayedCall(0.55, () => card.classList.remove("is-pulse"));
          });
        });
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [steps]);

  return (
    <ol ref={rootRef} className="agencia-method">
      {steps.map((step, i) => (
        <li key={step.title}>
          <GlassSurface as="article" preset="panel" className="agencia-method__card">
            <span className="agencia-method__n" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </GlassSurface>
        </li>
      ))}
    </ol>
  );
}
