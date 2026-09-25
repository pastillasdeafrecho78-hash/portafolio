"use client";

import { useEffect, useRef } from "react";
import { LiquidGlass } from "apple-liquid-glass-webgl";
import type { LiquidGlassElementOptions } from "apple-liquid-glass-webgl";

export type GlassPreset = "cta" | "header" | "panel";

/**
 * Material del header: cristal esmerilado, casi sin lupa.
 * Misma base para botones, barra y paneles.
 */
const FROST = {
  frost: 0.52,
  tint: 0.22,
  tintTone: "dark" as const,
  material: {
    refraction: 22,
    dispersion: 0.6,
    highlight: 0.22,
    rim: 0.16,
    reflection: 0.14,
    hairline: 0.7,
    edgeReach: 0.08,
    edgeWidth: 0.14,
    body: 0.82,
    absorption: 0.7,
    lightAngle: 136,
  },
};

const PRESETS: Record<
  GlassPreset,
  Pick<LiquidGlassElementOptions, "frost" | "tint" | "tintTone" | "material">
> = {
  cta: { ...FROST },
  header: {
    ...FROST,
    tint: 0.18,
    frost: 0.48,
  },
  panel: {
    ...FROST,
    frost: 0.58,
    tint: 0.4,
    material: {
      ...FROST.material,
      refraction: 18,
      highlight: 0.16,
      rim: 0.12,
      body: 0.88,
    },
  },
};

const SHARED_BACKDROP: LiquidGlassElementOptions["backdrop"] = [
  "auto",
  {
    source: "/illustrations/glass-field.png",
    fit: "cover",
    anchor: "viewport",
    opacity: 0.7,
  },
];

export type GlassTone = "default" | "amber";

type Options = {
  preset?: GlassPreset;
  followLight?: boolean;
  shape?: LiquidGlassElementOptions["shape"];
  /** Tinte de superficie encima del cristal (ámbar = acciones secundarias). */
  tone?: GlassTone;
};

const TONE_SURFACE: Record<
  GlassTone,
  Pick<LiquidGlassElementOptions, "tint" | "frost">
> = {
  default: {},
  amber: { tint: 0.38, frost: 0.56 },
};

/** Mount apple-liquid-glass-webgl — frost first, refraction almost off. */
export function useAppleGlass<T extends HTMLElement>(
  { preset = "cta", followLight = true, shape, tone = "default" }: Options = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const toneSurface = TONE_SURFACE[tone];
    const base = {
      ...PRESETS[preset],
      ...toneSurface,
      tint: toneSurface.tint ?? PRESETS[preset].tint,
      frost: toneSurface.frost ?? PRESETS[preset].frost,
    };
    const glass = new LiquidGlass(el, {
      ...base,
      shape,
      backdrop: SHARED_BACKDROP,
      live: true,
    });

    let raf = 0;
    let pointerX = 0.5;
    let pointerY = 0.35;

    const applyLight = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const lx = rect.left + rect.width * pointerX;
      const ly = rect.top + rect.height * pointerY;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = (Math.atan2(ly - cy, lx - cx) * 180) / Math.PI + 180;
      const dist = Math.min(
        1,
        Math.hypot(lx - cx, ly - cy) / (Math.max(rect.width, rect.height) * 0.6),
      );
      glass.update({
        material: {
          lightAngle: angle,
          highlight: (base.material?.highlight ?? 0.22) * (0.85 + dist * 0.25),
          rim: (base.material?.rim ?? 0.16) * (0.9 + dist * 0.2),
        },
      });
    };

    const onPointer = (e: PointerEvent) => {
      if (!followLight) return;
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / Math.max(rect.width, 1);
      pointerY = (e.clientY - rect.top) / Math.max(rect.height, 1);
      if (!raf) raf = requestAnimationFrame(applyLight);
    };

    const onDown = () => {
      glass.update({ tint: (base.tint ?? 0.22) + 0.08, frost: (base.frost ?? 0.52) + 0.04 });
    };
    const onUp = () => {
      glass.update({ tint: base.tint, frost: base.frost });
    };

    el.addEventListener("pointermove", onPointer, { passive: true });
    el.addEventListener("pointerenter", onPointer, { passive: true });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("pointerenter", onPointer);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onPointer);
      glass.destroy();
    };
  }, [preset, followLight, shape, tone]);

  return ref;
}
