"use client";

import Image from "next/image";
import { useEffect } from "react";

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: none), (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function SiteBackground() {
  useEffect(() => {
    const root = document.documentElement;
    let pointerX = 0.5;
    let pointerY = 0.35;
    let raf = 0;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      raf = 0;
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollT = Math.min(Math.max(window.scrollY / scrollMax, 0), 1);
      const scrollY = 0.22 + scrollT * 0.56;

      let x: number;
      let y: number;

      if (isCoarsePointer() || reduced) {
        x = 0.5;
        y = scrollY;
      } else {
        x = pointerX;
        y = pointerY * 0.6 + scrollY * 0.4;
      }

      root.style.setProperty("--light-x", `${(x * 100).toFixed(2)}%`);
      root.style.setProperty("--light-y", `${(y * 100).toFixed(2)}%`);
      root.style.setProperty("--scroll-t", scrollT.toFixed(4));
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };

    const onPointer = (e: PointerEvent) => {
      if (isCoarsePointer() || e.pointerType === "touch") return;
      pointerX = e.clientX / Math.max(window.innerWidth, 1);
      pointerY = e.clientY / Math.max(window.innerHeight, 1);
      schedule();
    };

    apply();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduced = motionQuery.matches;
      schedule();
    };
    motionQuery.addEventListener("change", onMotion);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motionQuery.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <div className="site-bg" data-glass-field aria-hidden="true">
      <div className="site-bg__photo">
        <Image
          src="/illustrations/glass-field.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="site-bg__photo-img"
          unoptimized
        />
      </div>
      <div className="site-bg__wash" />
      <div className="site-bg__light" />
    </div>
  );
}
