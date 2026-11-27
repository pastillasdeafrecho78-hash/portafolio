"use client";

import { useEffect, useRef } from "react";

export type GlassPreset = "cta" | "header" | "panel";
export type GlassTone = "default" | "amber";

type Options = {
  preset?: GlassPreset;
  followLight?: boolean;
  shape?: "pill" | "circle" | "rect" | "auto";
  tone?: GlassTone;
};

export function useAppleGlass<T extends HTMLElement>({ followLight = true }: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const element: HTMLElement = target;
    if (!element.matches(".header-glass, .glass-option")) {
      element.setAttribute("data-liquid-glass", "fallback");
      return;
    }

    element.setAttribute("data-liquid-glass", "lens");
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function sample() {
      frame = 0;
      const rect = element.getBoundingClientRect();
      if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) return;

      // Match the 16:9 artwork behind the page, then scale the crop around the control.
      const scale = 1.055;
      const width = Math.max(window.innerWidth, window.innerHeight * 16 / 9);
      const height = width * 9 / 16;
      const x = (window.innerWidth - width) / 2 - rect.left;
      const y = (window.innerHeight - height) / 2 - rect.top;
      element.style.setProperty("--glass-image-size", `${width * scale}px ${height * scale}px`);
      element.style.setProperty("--glass-image-position", `${x * scale - rect.width * (scale - 1) / 2}px ${y * scale - rect.height * (scale - 1) / 2}px`);

      if (!pointer || !followLight || reducedMotion.matches) return;
      const dx = pointer.x - rect.left - rect.width / 2;
      const dy = pointer.y - rect.top - rect.height / 2;
      const distance = Math.hypot(dx, dy);
      const xDirection = dx / Math.max(48, distance);
      const yDirection = dy / Math.max(48, distance);
      const gain = 0.4 + 0.6 * Math.exp(-distance / 650);
      const reach = Math.min(1, distance / 48);
      const angle = (Math.atan2(xDirection, -yDirection) * 180 / Math.PI + 360) % 360;

      element.style.setProperty("--glass-angle", `${angle}deg`);
      element.style.setProperty("--glass-rim-x", `${-2 * xDirection}px`);
      element.style.setProperty("--glass-rim-y", `${-2 * yDirection}px`);
      element.style.setProperty("--glass-sheen", String(0.26 * gain * reach));
      element.style.setProperty("--glass-shade", String(0.11 * gain * reach));
      element.style.setProperty("--glass-rim", String(0.75 + 0.15 * gain));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(sample);
    }

    function aim(event: PointerEvent) {
      if (!followLight || event.pointerType === "touch" || reducedMotion.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    }

    function resetLight() {
      pointer = null;
      for (const property of ["angle", "rim-x", "rim-y", "sheen", "shade", "rim"]) {
        element.style.removeProperty(`--glass-${property}`);
      }
    }

    sample();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", aim, { passive: true });
    reducedMotion.addEventListener("change", resetLight);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", aim);
      reducedMotion.removeEventListener("change", resetLight);
    };
  }, [followLight]);

  return ref;
}
