"use client";

import { useEffect, type RefObject } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Options = {
  childSelector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  scaleFrom?: number;
};

/** One-shot ScrollTrigger stagger reveal for children marked with data-reveal. */
export function useAgenciaReveal(
  rootRef: RefObject<HTMLElement | null>,
  {
    childSelector = "[data-reveal]",
    y = 28,
    stagger = 0.08,
    duration = 0.65,
    start = "top 78%",
    scaleFrom,
  }: Options = {},
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = getGsap();
    const reduced = prefersReducedMotion();
    const children = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(childSelector),
    );

    if (!children.length) {
      root.classList.add("is-revealed");
      return;
    }

    root.classList.add("is-motion");

    if (reduced) {
      gsap.set(children, { clearProps: "all", opacity: 1 });
      root.classList.add("is-revealed");
      return;
    }

    gsap.set(children, {
      opacity: 0,
      y,
      ...(scaleFrom != null ? { scale: scaleFrom } : null),
    });

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root,
        start,
        once: true,
      },
      onComplete: () => {
        root.classList.add("is-revealed");
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [rootRef, childSelector, y, stagger, duration, start, scaleFrom]);
}
