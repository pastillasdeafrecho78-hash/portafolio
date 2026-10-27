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

/**
 * Use the CSS glass material on every browser. Some WebGL drivers report
 * support but render the glass canvas opaque white, hiding the content.
 */
export function useAppleGlass<T extends HTMLElement>(_options: Options = {}) {
  void _options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current?.setAttribute("data-liquid-glass", "fallback");
  }, []);

  return ref;
}
