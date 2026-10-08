"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/agencia-motion";

type Props = {
  points: readonly number[];
  className?: string;
  /** When true, draw the stroke on mount/when parent reveals. */
  animate?: boolean;
};

/** Mini sparkline for demo dashboard KPIs. */
export function Sparkline({ points, className = "", animate = false }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const w = 120;
  const h = 36;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !animate) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      return;
    }

    const { gsap } = getGsap();
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.out",
      delay: 0.15,
    });

    return () => {
      tween.kill();
    };
  }, [animate, d]);

  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
