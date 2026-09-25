"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins once on the client. */
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
    registered = true;
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __tdST?: typeof ScrollTrigger }).__tdST = ScrollTrigger;
    }
  }
  return { gsap, ScrollTrigger, DrawSVGPlugin };
}
