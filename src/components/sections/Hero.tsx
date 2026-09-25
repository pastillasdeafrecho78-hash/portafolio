"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { ThinkDeepMark } from "@/components/brand/ThinkDeepMark";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarseOrNarrow() {
  return (
    window.matchMedia("(hover: none), (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

type Props = {
  onSettled?: () => void;
  /** Skip scrub when the site is already unlocked. */
  skipMotion?: boolean;
};

/**
 * Sticky scroll runway: draw mark + reveal wordmark while you scroll.
 * Freezes at full size (no shrink, no pin-kill jump). Scroll back up anytime
 * to see the same peak logo; questions live in the next section.
 */
export function Hero({ onSettled, skipMotion = false }: Props) {
  const stageRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markWrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    if (!stage || !path) return;

    const { gsap } = getGsap();
    const reduced = prefersReducedMotion();
    const mobile = isCoarseOrNarrow();
    const hint = hintRef.current;

    const applyFinal = () => {
      gsap.set(path, { drawSVG: "0% 100%" });
      gsap.set(markWrapRef.current, { clearProps: "transform" });
      gsap.set(wordRef.current, { opacity: 1, y: 0 });
      if (hint) gsap.set(hint, { opacity: 0, pointerEvents: "none" });
      stage.classList.add("hero-stage--settled");
    };

    const notifySettled = () => {
      if (settledRef.current) return;
      settledRef.current = true;
      applyFinal();
      onSettled?.();
    };

    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __tdForceSettle?: () => void }).__tdForceSettle = () => {
        applyFinal();
        notifySettled();
      };
    }

    if (reduced || skipMotion) {
      stage.classList.add("hero-stage--static");
      applyFinal();
      settledRef.current = true;
      onSettled?.();
      return;
    }

    gsap.set(path, { drawSVG: "0% 0%" });
    gsap.set(markWrapRef.current, { scale: 1, y: 0 });
    gsap.set(wordRef.current, { opacity: 0, y: 24 });
    if (hint) gsap.set(hint, { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        // No GSAP pin — CSS sticky handles it, so there's no spacer jump.
        once: true,
        onLeave: notifySettled,
        onUpdate: (self) => {
          if (hint) {
            // Hint se va en cuanto empiezas a bajar; el logo toma el protagonismo
            const fade = Math.max(0, 1 - self.progress / 0.08);
            gsap.set(hint, {
              opacity: fade,
              pointerEvents: fade < 0.05 ? "none" : "auto",
            });
          }
          if (self.progress >= 0.92) notifySettled();
        },
      },
    });

    tl.to(path, { drawSVG: "0% 100%", duration: 1, ease: "none" }, 0);
    tl.to(
      wordRef.current,
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      mobile ? 0.45 : 0.55,
    );

    return () => {
      tl.scrollTrigger?.kill(false);
      tl.kill();
    };
  }, [onSettled, skipMotion]);

  return (
    <section ref={stageRef} className="hero-stage" aria-label="Think Deep">
      <div className="hero-stage__viewport">
        <div className="hero-stage__stack">
          <div ref={markWrapRef} className="hero-stage__mark">
            <ThinkDeepMark ref={pathRef} className="hero-stage__svg" />
          </div>

          <h1 ref={wordRef} className="hero-stage__word">
            <span className="hero-stage__word-line">think</span>
            <span className="hero-stage__word-line">deep</span>
          </h1>
        </div>

        <div ref={hintRef} className="hero-scroll-hint" aria-hidden>
          <span className="hero-scroll-hint__glow" />
          <span className="hero-scroll-hint__line" />
          <span className="hero-scroll-hint__label">Desliza</span>
          <span className="hero-scroll-hint__chev">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 9.5 12 15l5.5-5.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
