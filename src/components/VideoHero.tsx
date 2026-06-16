"use client";

import { useEffect, useState } from "react";

export function VideoHero() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reduceMotion) {
    return (
      <div className="video-showcase flex items-center justify-center p-8" aria-hidden="true">
        <p className="text-center text-slate-400">Demo de sitios, formularios y paneles</p>
      </div>
    );
  }

  return (
    <div className="video-showcase" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata" poster="/video/hero-poster.svg">
        <source src="/video/hero-demo.webm" type="video/webm" />
        <source src="/video/hero-demo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
