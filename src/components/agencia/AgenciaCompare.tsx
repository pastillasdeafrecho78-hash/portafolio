"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Col = {
  title: string;
  subtitle: string;
  items: readonly string[];
};

export function AgenciaCompare({
  before,
  after,
}: {
  before: Col;
  after: Col;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = getGsap();
    const beforeCol = root.querySelector<HTMLElement>(".agencia-compare__col:not(.is-after)");
    const afterCol = root.querySelector<HTMLElement>(".agencia-compare__col.is-after");
    const checks = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".agencia-compare__col.is-after li"),
    );
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([beforeCol, afterCol, checks], { clearProps: "all", opacity: 1 });
      afterCol?.classList.add("is-open");
      return;
    }

    gsap.set(beforeCol, { opacity: 0, x: -24 });
    gsap.set(afterCol, { opacity: 0, x: 24, clipPath: "inset(0 100% 0 0)" });
    gsap.set(checks, { opacity: 0, x: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        once: true,
      },
    });

    tl.to(beforeCol, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" })
      .to(
        afterCol,
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.7,
          ease: "power3.out",
          onStart: () => afterCol?.classList.add("is-open"),
        },
        "-=0.2",
      )
      .to(
        checks,
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" },
        "-=0.25",
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === root)
        .forEach((st) => st.kill());
    };
  }, [before, after]);

  return (
    <div ref={rootRef} className="agencia-compare">
      <GlassSurface as="article" preset="panel" className="agencia-compare__col">
        <p className="agencia-compare__eyebrow">{before.title}</p>
        <h3>{before.subtitle}</h3>
        <ul>
          {before.items.map((item) => (
            <li key={item}>
              <span className="agencia-compare__x" aria-hidden>
                ×
              </span>
              {item}
            </li>
          ))}
        </ul>
      </GlassSurface>
      <GlassSurface as="article" preset="panel" className="agencia-compare__col is-after">
        <p className="agencia-compare__eyebrow">{after.title}</p>
        <h3>{after.subtitle}</h3>
        <ul>
          {after.items.map((item) => (
            <li key={item}>
              <span className="agencia-compare__check" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </GlassSurface>
    </div>
  );
}
