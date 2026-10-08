"use client";

import { useEffect, useRef, useState } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { Sparkline } from "@/components/agencia/Sparkline";
import { getGsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/agencia-motion";

type Kpi = {
  label: string;
  value: string;
  delta: string;
  points: readonly number[];
};

type Channel = {
  label: string;
  pct: number;
};

export function MarketingDashboard({
  kpis,
  channels,
}: {
  kpis: readonly Kpi[];
  channels: readonly Channel[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = getGsap();
    const reduced = prefersReducedMotion();
    const fills = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-dash__fill"));
    const kpisEls = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-dash__kpi"));
    const values = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-dash__value"));

    const play = () => {
      setDrawn(true);
      if (reduced) {
        fills.forEach((el) => {
          const pct = el.dataset.pct ?? "0";
          el.style.width = `${pct}%`;
        });
        gsap.set(kpisEls, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(fills, { width: 0 });
      gsap.set(kpisEls, { opacity: 0, y: 16, scale: 0.96 });
      gsap.set(values, { scale: 0.85 });

      const tl = gsap.timeline();
      tl.to(kpisEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
      })
        .to(
          values,
          { scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.6)" },
          "-=0.35",
        )
        .to(
          fills,
          {
            width: (_i, el) => `${(el as HTMLElement).dataset.pct}%`,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.2",
        );
    };

    if (reduced) {
      play();
      return;
    }

    const { ScrollTrigger } = getGsap();
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      once: true,
      onEnter: play,
    });

    let hoverCleanups: Array<() => void> = [];
    if (isFinePointer()) {
      hoverCleanups = kpisEls.map((el) => {
        const enter = () =>
          gsap.to(el, { scale: 1.03, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        const leave = () =>
          gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
        };
      });
    }

    return () => {
      st.kill();
      hoverCleanups.forEach((fn) => fn());
    };
  }, [kpis, channels]);

  return (
    <div ref={rootRef}>
      <GlassSurface preset="panel" className="agencia-dash">
        <div className="agencia-dash__head">
          <span className="agencia-dash__badge">Vista de ejemplo</span>
          <span className="agencia-dash__period">Últimos 30 días</span>
        </div>
        <div className="agencia-dash__kpis">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="agencia-dash__kpi">
              <div className="agencia-dash__kpi-top">
                <span className="agencia-dash__kpi-label">{kpi.label}</span>
                <span
                  className={`agencia-dash__delta ${
                    kpi.delta.startsWith("−") || kpi.delta.startsWith("-")
                      ? "is-down"
                      : "is-up"
                  }`}
                >
                  {kpi.delta}
                </span>
              </div>
              <strong className="agencia-dash__value">{kpi.value}</strong>
              <Sparkline points={kpi.points} className="agencia-dash__spark" animate={drawn} />
            </div>
          ))}
        </div>
        <div className="agencia-dash__channels">
          <p className="agencia-dash__channels-label">Conversiones por canal</p>
          {channels.map((ch) => (
            <div key={ch.label} className="agencia-dash__bar-row">
              <div className="agencia-dash__bar-meta">
                <span>{ch.label}</span>
                <span>{ch.pct}%</span>
              </div>
              <div className="agencia-dash__track" aria-hidden>
                <div
                  className="agencia-dash__fill"
                  data-pct={ch.pct}
                  style={{ width: drawn ? `${ch.pct}%` : 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
}
