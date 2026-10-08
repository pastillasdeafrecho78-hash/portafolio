"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Line = { n: number; code: string };

export function CodePanel({ lines }: { lines: readonly Line[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = getGsap();
    const rowEls = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-code__line"));
    const caret = root.querySelector<HTMLElement>(".agencia-code__caret");
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(rowEls, { opacity: 1, x: 0 });
      if (caret) gsap.set(caret, { opacity: 1 });
      return;
    }

    gsap.set(rowEls, { opacity: 0, x: -10 });
    if (caret) gsap.set(caret, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        once: true,
      },
    });

    tl.to(rowEls, {
      opacity: 1,
      x: 0,
      duration: 0.35,
      stagger: 0.14,
      ease: "power2.out",
    });

    if (caret) {
      tl.to(caret, { opacity: 1, duration: 0.2 }, "-=0.1");
      tl.to(caret, {
        opacity: 0.15,
        duration: 0.55,
        repeat: 5,
        yoyo: true,
        ease: "steps(1)",
      });
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [lines]);

  return (
    <div ref={rootRef}>
      <GlassSurface preset="panel" className="agencia-code" as="article">
        <div className="agencia-code__chrome" aria-hidden>
          <span />
          <span />
          <span />
          <em>flujo.ts</em>
        </div>
        <pre className="agencia-code__pre">
          <code>
            {lines.map((line, i) => (
              <span key={line.n} className="agencia-code__line">
                <span className="agencia-code__n">{line.n}</span>
                <span className="agencia-code__src">
                  {line.code}
                  {i === lines.length - 1 ? (
                    <span className="agencia-code__caret" aria-hidden>
                      ▍
                    </span>
                  ) : null}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </GlassSurface>
    </div>
  );
}
