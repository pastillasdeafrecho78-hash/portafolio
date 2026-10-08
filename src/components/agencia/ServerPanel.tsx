"use client";

import { useEffect, useRef } from "react";
import { GlassSurface } from "@/components/effects/GlassCTA";
import { getGsap } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/agencia-motion";

type Gauge = { label: string; pct: number };

export function ServerPanel({
  gauges,
  events,
}: {
  gauges: readonly Gauge[];
  events: readonly string[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = getGsap();
    const rings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".agencia-server__ring"));
    const labels = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".agencia-server__ring span"),
    );
    const eventItems = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".agencia-server__events li"),
    );
    const reduced = prefersReducedMotion();

    const play = () => {
      if (reduced) {
        rings.forEach((ring) => {
          const pct = Number(ring.dataset.pct ?? 0);
          ring.style.setProperty("--pct", String(pct));
          const label = ring.querySelector("span");
          if (label) label.textContent = `${pct}%`;
        });
        gsap.set(eventItems, { opacity: 1, x: 0 });
        return;
      }

      rings.forEach((ring, i) => {
        const target = Number(ring.dataset.pct ?? 0);
        const label = labels[i];
        const proxy = { pct: 0 };
        ring.style.setProperty("--pct", "0");
        if (label) label.textContent = "0%";

        gsap.to(proxy, {
          pct: target,
          duration: 1.15,
          delay: i * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            const v = Math.round(proxy.pct);
            ring.style.setProperty("--pct", String(v));
            if (label) label.textContent = `${v}%`;
          },
        });
      });

      gsap.fromTo(
        eventItems,
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.1,
          delay: 0.35,
          ease: "power2.out",
        },
      );
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      once: true,
      onEnter: play,
    });

    let hoverCleanups: Array<() => void> = [];
    if (isFinePointer() && !reduced) {
      hoverCleanups = rings.map((ring) => {
        const enter = () => ring.classList.add("is-hot");
        const leave = () => ring.classList.remove("is-hot");
        ring.addEventListener("pointerenter", enter);
        ring.addEventListener("pointerleave", leave);
        return () => {
          ring.removeEventListener("pointerenter", enter);
          ring.removeEventListener("pointerleave", leave);
        };
      });
    }

    return () => {
      st.kill();
      hoverCleanups.forEach((fn) => fn());
    };
  }, [gauges, events]);

  return (
    <div ref={rootRef}>
      <GlassSurface preset="panel" className="agencia-server">
        <div className="agencia-server__gauges">
          {gauges.map((g) => (
            <div key={g.label} className="agencia-server__gauge">
              <div
                className="agencia-server__ring"
                data-pct={g.pct}
                style={{ ["--pct" as string]: "0" }}
                aria-hidden
              >
                <span>0%</span>
              </div>
              <strong>{g.label}</strong>
            </div>
          ))}
        </div>
        <div className="agencia-server__events">
          <p>Últimos eventos</p>
          <ul>
            {events.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </GlassSurface>
    </div>
  );
}
